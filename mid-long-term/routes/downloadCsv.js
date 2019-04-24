import express from 'express'
import { createObjectCsvWriter, } from 'csv-writer'
import fs from 'fs'
import uniqueFilename from 'unique-filename'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
import {map, getFromNum, } from 'projectRoot/data/operation/mapping.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async (req,res)=>{
  try {
    const {dataValues, } = await Data.findOne({
      where: {
        campusId: res.locals.campusId,
        typeId: res.locals.typeId,
        yearFrom: res.locals.year, // TODO
        yearTo: res.locals.year, // TODO
        userId: req.session.userId
      },
      attributes: ['dataId']
    })

    if( dataValues != null) {
      let tmpDir = '/tmp/selection_Web'
      if( !fs.existsSync(tmpDir) )
        fs.mkdirSync(tmpDir)

      let filePath = uniqueFilename(tmpDir)

      // setup csvWriter
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          {id: 'aspect', title: '構面', },
          {id: 'keypoint', title: '推動重點', },
          {id: 'method', title: '具體作法', },
          {id: 'title', title: '標題', },
          {id: 'content', title: '內容', },
        ],
      })
      // write in the tmp output file
      let outputObject = []

      let data = await Content.findAll({
        where: {
          dataId: dataValues.dataId,
        },
      })
        .then(data => {return data})
        .catch(err => {throw err})

      data = data.map(val => val.dataValues)

      for(let val of data){
        outputObject.push({
          aspect: getFromNum(map, {dimension: val.aspect, }),
          keypoint: getFromNum(map, {item: val.keypoint, }),
          method: getFromNum(map, {detail: val.method, }),
          title: val.title,
          content: val.content,
        })
      }

      await csvWriter.writeRecords(outputObject)

      // send requested output file
      let options = {
        root: '/',
        dotfiles: 'deny',
        headers: {
          'content-type': 'text/csv',
          'Content-Disposition': `attachment;filename=${encodeURIComponent(req.params.campusName)}.csv`,
        },
      }
      res.sendFile(filePath, options, function(err){
        if(err){
          throw err
        }
        else{
          fs.unlink(filePath, function(err){
            if(err)
              throw err
          })
        }
      })
    }else {
      throw new Error('No specified dataId')
    }
  } catch (err) {
    console.log(err)
  }
})

export default router