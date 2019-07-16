
import fs from 'fs'
import csv from 'csv-parser'

import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'
import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'
import shortTermData from 'projectRoot/short-term/models/schemas/Data.js'
import shortTermContent from 'projectRoot/short-term/models/schemas/Content.js'


import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'

import readCsv from 'projectRoot/data/operation/csv-to-db/read-csv.js'


export default async (filename, root_dir, typeData = '') => {
  try{
    let info = filename.split('_')
    let year, typeId, tempData, fnData, fnContent
    if(typeData == 'midLongTerm'){
      year = [info[0], info[1]]
      typeId = info[2] == '大學'? 0 : 1
      tempData = {
        yearFrom: year[0],
        yearTo: year[1],
        typeId: typeId,
        campusId: campusMap[typeId].campus.indexOf(info[3].split(".")[0]),
        userId: 6
      }
      fnData = midLongTermData
      fnContent = midLongTermContent
    }else if(typeData == 'shortTerm'){
      year = info[0]
      typeId = info[1] == '大學'? 0 : 1
      tempData = {
        typeId: typeId,
        year: year,
        campusId: campusMap[typeId].campus.indexOf(info[2].split(".")[0]),
        userId: 6
      }
      fnData = shortTermData
      fnContent = shortTermContent
    }else {
      throw new Error('wrong type data')
    }
    //create the data
    // const data = await fnData
    // .create(tempData)
    // .then( data => data.dataValues )
    // console.log(data)
    const {result,wrongResult} = await readCsv(root_dir + filename)
    // console.log(result[0])
    // await Promise.all( result.map( async (d) => {
    //   await fnContent.create({
    //     title1: d.title1,
    //     title2: d.title2,
    //     title3: d.title3,
    //     title4: d.title4,
    //     content: d.content,
    //     summary: d.summary,
    //     pageFrom: d.pageFrom,
    //     pageTo: d.pageTo,
    //     isChecked: 0,
    //     isConflicted: 0,
    //     aspect: d.aspect,
    //     keypoint: d.keypoint,
    //     method: d.method,
    //     updateTime: Date.now(),
    //     dataId: data.dataId,
    //   }).catch( (err) => {
    //     console.log(data.campusId)
    //     console.log(`occurred error`)
    //     console.log(d)
    //     console.log(err)
    //     console.log("===============================")
    //   })
    // }))
    // console.log(wrongResult)
    let temp = {
      info: tempData}
    console.log(wrongResult)
    temp[`${info[info.length-1].split('.')[0]}`] = wrongResult
    console.log(temp)
    return temp
    // console.log(result)
  }catch(err) {
    console.log(err)
  }
}
