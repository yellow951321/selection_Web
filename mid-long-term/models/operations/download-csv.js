import fs from 'fs'
import uniqueFilename from 'unique-filename'
import {createObjectCsvWriter, } from 'csv-writer'
import Content from 'mid-long-term/models/schemas/Content.js'
import {map, getFromNum, } from 'projectRoot/data/operation/mapping.js'

export default async(dataId) => {
  try{
    let tmpDir = '/tmp/selection_Web'
    if(!fs.existsSync(tmpDir))
      fs.mkdirSync(tmpDir)

    let filePath = uniqueFilename(tmpDir)

    // setup csvWriter
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        {id: 'aspect', title: '構面', },
        {id: 'keypoint', title: '推動重點', },
        {id: 'method', title: '具體作法', },
        {id: 'title1', title: '大標題', },
        {id: 'title2', title: '中標題', },
        {id: 'title3', title: '小標題', },
        {id: 'title4', title: '最小標題', },
        {id: 'content', title: '內容', },
      ],
    })
    // write in the tmp output file
    let outputObject = []

    let data = await Content.findAll({
      where: {
        dataId: dataId,
      },
      attributes:[
        'contentId',
        'title1',
        'title2',
        'title3',
        'title4',
        'content',
        'summary',
        'note',
        'aspect',
        'keypoint',
        'method',
      ],
    })
      .then(data => {
        if(data == null)
          return []
        return data.map(val => val.dataValues)
      })
      .catch(err => {throw err})

    for(let val of data) {
      outputObject.push({
        aspect: getFromNum(map, {dimension: val.aspect, }),
        keypoint: getFromNum(map, {item: val.keypoint, }),
        method: getFromNum(map, {detail: val.method, }),
        title1: val.title1,
        title2: val.title2,
        title3: val.title3,
        title4: val.title4,
        content: val.content,
      })
    }

    await csvWriter.writeRecords(outputObject)

    return filePath

  }catch(err){
    if(!err.status){
      err = new Error('Error occurred in mid-long-term/models/operations/download-csv.js', err)
      err.status = 500
    }
    throw err
  }
}