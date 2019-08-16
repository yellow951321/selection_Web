import express from 'express'
import fs from 'fs'
import createCsv from 'mid-long-term/models/operations/download-csv.js'
import Data from 'mid-long-term/models/schemas/Data.js'
import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/:dataId/index', async(req, res, next)=>{
  try {
    const {filePath, data} = await createCsv({
      dataId: req.params.dataId
    })

    const options = {
      root: '/',
      dotfiles: 'deny',
      headers: {
        'content-type': 'text/csv',
        'Content-Disposition': `attachment;filename=${encodeURIComponent(campusMap[data.typeId]['campus'][data.campusId])}${data.yearFrom}to${data.yearTo}.csv`,
      },
    }
    res.sendFile(filePath, options, (err) => {
      if(err){
        err = new Error("send file failed")
        err.status = 500
        throw err
      }
      else{
        fs.unlink(filePath, (err) => {
          if(err){
            err = new Error("file unlink failed")
            err.status = 500
            throw err
          }
        })
      }
    })
  } catch (err) {
    if(!err.status){
      err = new Error("Error occurred in downloadCsv.js")
      err.status = 500
    }
    next(err)
  }
})

export default router