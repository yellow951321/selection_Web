import fs from 'fs'
import uniqueFilename from 'unique-filename'
import {createObjectCsvWriter, } from 'csv-writer'
import {Content, Data, } from 'mid-long-term/models/association.js'
import {midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  if(typeof info.dataId !== 'number' || Number.isNaN(Number(info.dataId))){
    const err = new Error('dataId is NaN')
    err.status = 400
    throw err
  }
  info.dataId = Number(info.dataId)

  let tmpDir, filePath
  try{
    tmpDir = '/tmp/selection_Web'
    if(!fs.existsSync(tmpDir))
      fs.mkdirSync(tmpDir)

<<<<<<< HEAD
    info.dataId = Number(info.dataId)
    if(Number.isNaN(info.dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    let tmpDir, filePath
    try{
      tmpDir = '/tmp/selection_Web'
      if(!fs.existsSync(tmpDir))
        fs.mkdirSync(tmpDir)

      filePath = uniqueFilename(tmpDir)
    }catch(err){
      err = new Error('create file failed')
      err.status = 507
      throw err
    }
=======
    filePath = uniqueFilename(tmpDir)
  }catch(err){
    err = new Error('create file failed')
    err.status = 507
    throw err
  }
>>>>>>> 988fea74cb1d9925d7f9b2012afb467640998d10

  let csvWriter
  try{
    csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        {id: 'pageFrom', title: '開始頁面', },
        {id: 'pageTo', title: '結束頁面', },
        {id: 'aspect', title: '構面', },
        {id: 'keypoint', title: '推動重點', },
        {id: 'method', title: '具體作法', },
        {id: 'title1', title: '大標題', },
        {id: 'title2', title: '中標題', },
        {id: 'title3', title: '小標題', },
        {id: 'title4', title: '最小標題', },
        {id: 'content', title: '內容', },
        {id: 'summary', title: '摘要', },
        {id: 'note', title: '備註', },
      ],
    })
  }catch(err){
    err = new Error('setting csv config failed')
    err.status = 500
    throw err
  }
  // write in the tmp output file
  let outputObject = []
  let data

  try{
    data = await Content.findAll({
      where: {
        dataId: info.dataId,
      },
      attributes:[
        'pageFrom',
        'pageTo',
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
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  try{
    for(let val of data) {
      let method = midLongTermFromNumber({aspect: val.aspect, keypoint: val.keypoint, method: val.method, }).method
      let keypoint = midLongTermFromNumber({aspect: val.aspect, keypoint: val.keypoint, }).keypoint
      let aspect = midLongTermFromNumber({aspect: val.aspect, }).aspect

      outputObject.push({
        pageFrom: val.pageFrom,
        pageTo: val.pageTo,
        aspect,
        keypoint,
        method,
        title1: val.title1,
        title2: val.title2,
        title3: val.title3,
        title4: val.title4,
        content: val.content,
        summary: val.summary,
        note: val.note,
      })
    }
  }catch(err){
    err = new Error('data formatting failed')
    err.status = 500
    throw err
  }

  try{
    await csvWriter.writeRecords(outputObject)
  }catch(err){
    err = new Error('create Csv file failed')
    err.status = 500
    throw err
  }

  try{
    data = await Data.findOne({
      where: {
        dataId: info.dataId,
      },
      attribute: [
        'yearFrom',
        'yearTo',
        'campusId',
        'typeId',
      ],
    })
  }catch(err){
    err = new Error('data featch failed')
    err.status = 500
    throw err
  }

  return {
    filePath: filePath,
    data: data,
  }
}