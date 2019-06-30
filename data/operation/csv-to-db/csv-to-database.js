
import fs from 'fs'
import csv from 'csv-parser'

import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'
import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'

import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'


const readCsv = (filename) => {

  let map = ['B','C','D','E','F','G','H']
  let result = []
  return new Promise((res,rej)=>{
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => {
      let flag = false
      // for(let pro in data) {
      //   if (data[pro] == "" && (pro == '構面' || pro == '推動重點' || pro == '作法' || pro == '頁碼起始' || pro == '頁碼結束')) {
      //     flag = true
      //   }
      //   if(flag)
      //     console.log(data)
      // }
      let temp = {
        pageFrom : data['頁碼起始'] == "" ? (data['頁碼結束'] == "" ? 0 : data['頁碼結束'])  : data['頁碼起始'],
        pageTo : data['頁碼結束'] == "" ? 0 : data['頁碼結束'],
        title1 : data['大標題'],
        title2 : data['中標題'],
        title3 : data['小標題'],
        title4 : data['最小標題'],
        content : data['內容'],
        summary : data['摘要'],
        note : data['備註'],
        aspect : map.indexOf(data['構面']),
        keypoint : /[GH]/.test(data['構面']) ? 0 : Number(data['推動重點'])-1,
        method : /[GH]/.test(data['構面']) ? 0 : Number(data['作法']) -1,
      }

      result.push(temp)
    })
    .on('end', () => {
      res(result)
      console.log('finished')
    })
    .on('error', () => {
      rej(new Error('Something wrong'))
    })
  })
  .then( data => {
    return data
  })
  .catch( err => {
    console.log(err)
  })
}


export default async (filename, root_dir) => {
  try{
    let info = filename.split("_")
    let year = [info[0], info[1]]
    let typeId = info[2] == '大學'? 0 : 1
    //create the data
    const data = await midLongTermData.create({
      yearFrom: year[0],
      yearTo: year[1],
      typeId: info[2] == '大學'? 0 : 1,
      userId: 6,
      campusId: campusMap[typeId].campus.indexOf(info[3].split(".")[0])
    }).then( data => data.dataValues)
    // console.log(data)
    const result = await readCsv(root_dir + filename)
    // console.log(result[0])
    Promise.all( result.map( async (d) => {
      await midLongTermContent.create({
        title1: d.title1,
        title2: d.title2,
        title3: d.title3,
        title4: d.title4,
        content: d.content,
        summary: d.summary,
        pageFrom: d.pageFrom,
        pageTo: d.pageTo,
        isChecked: 0,
        isConflicted: 0,
        aspect: d.aspect,
        keypoint: d.keypoint,
        method: d.method,
        updateTime: Date.now(),
        dataId: data.dataId,
      })
    }))
    // console.log(result)
  }catch(err) {
    console.log(err)
  }
}
