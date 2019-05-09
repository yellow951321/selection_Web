import shortTermContent from 'short-term/models/schemas/Content.js'
import shortTermData from 'short-term/models/schemas/Data.js'

import {map, getFromNum, getFromWord} from 'projectRoot/data/operation/mapping.js'

import { shortTermFromWord, midLongTermFromNumber} from 'lib/static/javascripts/mapping/label.js'
import Obj from 'lib/static/javascripts/mapping/label.js'
const newMap = Obj.map

import campusMap from 'lib/static/javascripts/mapping/campus.js'

import fs, { readFile, readFileSync } from 'fs'
import Readline from 'readline'
import { promised } from 'q';

const root = '/home/nober/git/selection_Web/data/json-data'

const readCsv = async (root,filename='') => {
  try{
    let label = {}
    let label2num = []

    let i = 0
    const rline = Readline.createInterface({
      input: fs.createReadStream(`${root}/${filename}`,{encoding: 'utf-8'}),
    })
    const result = new Promise((res,rej)=> {
      rline.on('line', (chunk) => {
        if ( i++ == 0 ){
          chunk.split(',').map(l => {
            label[l] = []
            label2num.push(l)
          })
        }
        else
          chunk.split(',',8).map((content,index) => {
            label[label2num[index]].push(content)
          })
      })
      rline.on('close', ()=> {
        res({label , label2num})
      })
    })

    return result
  }catch(err){
    console.log(err)
  }
}

const readJson = async (root, filename) => {
  try{
    // console.log(`${root}/${filename}`)

    const data = await new Promise((res,rej) => {
      readFile(`${root}/${filename}`, 'utf-8', (err, data) => {
        if(err)
          rej(new Error(err))
        res(JSON.parse(data))
      })
    })

    let year = data['年度']
    let campus = data['學校']
    let type = data['類型']

    let contents = []
    Object.keys(data).map( aspect => {
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        Object.keys(data[aspect]).map(keypoint => {
          Object.keys(data[aspect][keypoint]).map(method => {
            let t = {}
            let _content = data[aspect][keypoint][method]
            // console.log(_content)
            _content.map( c => {
              if(c.page.length != 0){
                let p = c.page[0].split('-')
                let pageFrom ,pageTo
                p.map( (num, index) => {
                  if(index % 2 == 0)
                    pageFrom = num
                  else
                    pageTo = num
                })
                contents.push({
                  pageFrom,
                  pageTo,
                  aspect,
                  keypoint,
                  method,
                  title: c.title,
                  content: c.paragraph
                })
              }
            })
          })
        })
      }
    })

    return {year, campus, type, contents}

  }catch(err) {
    console.log(err)
  }
}

const parseData = (data) => {
  try{
    // console.log(`${root}/${filename}`)

    let year = data['年度']
    let campus = data['學校']
    let type = data['類型']

    let contents = []
    Object.keys(data).map( aspect => {
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        Object.keys(data[aspect]).map(keypoint => {
          Object.keys(data[aspect][keypoint]).map(method => {
            let t = {}
            let _content = data[aspect][keypoint][method]
            // console.log(_content)
            _content.map( c => {
              if(c.page.length != 0){
                let p = c.page[0].split('-')
                let pageFrom ,pageTo
                p.map( (num, index) => {
                  if(index % 2 == 0)
                    pageFrom = num
                  else
                    pageTo = num
                })
                contents.push({
                  pageFrom,
                  pageTo,
                  aspect,
                  keypoint,
                  method,
                  title: c.title,
                  content: c.paragraph
                })
              }
            })
          })
        })
      }
    })

    return {year, campus, type, contents}

  }catch(err) {
    console.log(err)
  }
}

const createNewDataAndContent = async (info={}, contents) => {
  try{
    let typeId = info.type == '大學' ? 0 : 1
    let campusId = getFromWord(map, {type: info.type, campus: info.campus})
    // const data = await shortTermData.create({
    //   campusId: campusId,
    //   userId: 6,
    //   typeId: typeId,
    //   year: info.year
    // })
    await Promise.all( contents.map( async contentInfo => {
      let id = shortTermFromWord({ aspect: contentInfo.aspect, keypoint: contentInfo.keypoint, method: contentInfo.method })
      console.log(id)
      // await shortTermContent.create({
      //   aspect: id.aspect,
      //   keypoint: id.keypoint,
      //   method: id.method,
      //   title1: contentInfo.title,
      //   pageFrom: contentInfo.pageFrom,
      //   pageTo: contentInfo.pageTo,
      //   content: contentInfo.content,
      //   dataId: data.dataId
      // })
    }))
  }catch(err){
    console.log(err)
  }
}

const modifiedKey = (json,template) => {
  try{
    let data = JSON.parse(json)


    let result = {}
    Object.keys(data).map((aspect,aspect_i) => {
      aspect_i = aspect_i - 3
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        result[template[aspect_i]["shortTerm"]] = {}
        Object.keys(data[aspect]).map((keypoint, keypoint_i) => {
          result[template[aspect_i]["shortTerm"]][template[aspect_i].keypoint[keypoint_i]["shortTerm"]] = {}
          Object.keys(data[aspect][keypoint]).map((method, method_i) => {
            result[template[aspect_i]["shortTerm"]][template[aspect_i].keypoint[keypoint_i]["shortTerm"]][template[aspect_i].keypoint[keypoint_i].method[method_i]["shortTerm"]] = data[aspect][keypoint][method]
          })
        })
      }
    })

    Object.keys(result).map((aspect, aspect_i) => {
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        Object.keys(result[aspect]).map((keypoint, keypoint_i) => {
          Object.keys(result[aspect][keypoint]).map((method, method_i) => {
            shortTermFromWord({aspect, keypoint, method})
          })
        })
      }
    })

    result['年度'] = data['年度']
    result['學校'] = data['學校']
    result['類型'] = data['類型']

    return result
  }catch(err){
    console.log(err)
  }
}


const updateContent = async () => {

  let data = await midLongTermContent.findAll({
    attributes: [
      'aspect',
      'keypoint',
      'method'
    ]
  })

  await Promise.all( data.map( async d => {
    let aspectName = getFromNum(map, {dimension: d.aspect})
    let keypointName = getFromNum(map, {item: d.keypoint})
    let methodName = getFromNum(map, {detail: d.method})
    console.log(d.aspect, d.keypoint, d.method)
    console.log(aspectName, keypointName, methodName)

    const {aspect, keypoint ,method, } = shortTermFromWord({
      aspect: aspectName,
      keypoint: keypointName,
      method: methodName
    })
    await d.update({
      aspect: aspect,
      keypoint: keypoint,
      method: method
    }).then(d => {
      console.log("finished")
    })
  }))

}

const check = async (root,name) => {
  try{
    const data = await new Promise((res,rej)=>{
      readFile(`${root}/${name}`, (err, file) => {
        if(err)
          rej(err)
        res(JSON.parse(file))
      })
    })

    Object.keys(data).map((aspect, aspect_i) => {
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        Object.keys(data[aspect]).map((keypoint, keypoint_i) => {
          Object.keys(data[aspect][keypoint]).map((method, method_i) => {
            shortTermFromWord({aspect, keypoint, method})
          })
        })
      }
    })
  }catch(err){
    console.log(err)
  }
}

const buildTemplate = (json) => {
  try{
    let data = JSON.parse(json)

    let t = []
    Object.keys(data).map((aspect, aspect_i) => {
      if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
        let t_keypoint = []
        Object.keys(data[aspect]).map((keypoint, keypoint_i) => {
          let t_method = []
          Object.keys(data[aspect][keypoint]).map((method, method_i) => {
            t_method.push({
              "shortTerm" : method
            })
          })
          t_keypoint.push({
            "shortTerm": keypoint,
            method: t_method}
          )
        })
        t.push({
          "shortTerm": aspect,
          keypoint: t_keypoint})
      }
    })

    return t
  }catch(err){
    console.log(err)
  }
}


// updateContent()

const t = async () => {

  for(let i =0 ;i<1;i++){
    const jsonFiles = await new Promise((res,rej)=>{
      fs.readdir(`${root}/${i+1}`, (err, files) => {
        if(err)
          rej(err)
        res(files)
      })
    })

    // await Promise.all(  jsonFiles.map( async filename => {
    //   const result = await readJson(`${root}/${i+1}`,'中原大學.json')
    //   await createNewDataAndContent({
    //     campus: result.campus,
    //     year: result.year,
    //     type: result.type,
    //   },result.contents)
    // }))
    await Promise.all( jsonFiles.map(async filename => {
      const data = await new Promise((res,rej) => {
        readFile(`${root}/${i+1}/${filename}`, 'utf-8', (err, data) => {
          if(err)
            rej(new Error(err))
          res(data)
        })
      })
      const template = buildTemplate(readFileSync(`${root}/1/中原大學.json`))
      const modifiedData = modifiedKey(data,template)
      const result = parseData(modifiedData)
      await createNewDataAndContent({
        campus: result.campus,
        year: result.year,
        type: result.type
      },result.contents)
    }))

  }


  // console.log(result)
}

t()
