import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'
import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'

import { map, midLongTermFromNumber } from 'projectRoot/lib/static/javascripts/mapping/label.js'

import fs from 'fs'

const label_schema = () => {
  const file = fs.readFileSync('data/newMap/outputMap.json', {encoding: 'utf-8'})
  const schema = JSON.parse(file)

  console.log(schema)

  // let schema_num = []
  // schema.forEach( aspect => {
  //   let temp = {}
  //   let keypoints = aspect.keypoint
  //   temp['label'] = aspect.label
  //   keypoints.forEach( keypoint => {
  //     let methods = keypoint.method
  //     methods.forEach( method => {

  //     })
  //   })
  // });

  return schema
}

const valid_content = (content = {}) => {
  try{
    // console.log(content)
    const aspect = Number(content.aspect)
    const keypoint = Number(content.keypoint)
    const method = Number(content.method)

    // console.log(`aspect: ${aspect}`)
    // console.log(`keypoint: ${keypoint}`)
    // console.log(`method: ${method}`)
    if(aspect == -1 && keypoint == -1 && method == -1){
      // 不具體
      return false
    }else if(aspect == -1 && keypoint == -1){
      // 尚未分類
      return true
    }else if(aspect == -1){
      return true
    }

    const result = map[aspect].keypoint[keypoint].method[method]

    let temp = midLongTermFromNumber({
      aspect,
      keypoint,
      method
    })

    if(result == undefined || result == null){
      // console.log(result)
      return false
    }else if( typeof result === 'object' ){
      // console.log(content)
      return true
    }
  }catch(err){
    if(err.status)
      console.log('Aspect error')
    console.log(err)
  }
}

const valid_db = async () => {
  try{

    const data = await midLongTermContent.findAll({})

    let result = []

    // console.log(map)

    // let i = 0
    // await Promise.all( data.map( ({dataValues}, index, arr) => {
    //   return (() => {
    //     console.log('here')
    //     if( !valid_content(dataValues) ){
    //       result.push(dataValues)
    //     }
    //   })()
    //   // console.log(index)
    // }))

    data.forEach( ({dataValues}) => {
      // console.log('here')
        if( !valid_content(dataValues) ){
          result.push(dataValues)
        }
    })

    console.log(result)
    await new Promise((res,rej)=>{
      fs.writeFile('data/csv-validation/error.json', JSON.stringify(result), (err)=>{
        if(err)
          rej()

        res()
      })
    })

  }catch(err){
    console.log(err)
  }
}


export {valid_db}

