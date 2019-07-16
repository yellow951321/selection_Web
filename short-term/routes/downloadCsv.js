import express from 'express'
import fs from 'fs'
import createCsv from 'short-term/models/operations/download-csv.js'
import Data from 'short-term/models/schemas/Data.js'
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
    const dataId = Number(req.params.dataId);
    if(Number.isNaN(dataId)){
      const err = new Error('invalid argument while entrying edit page')
      err.status = 400
      throw err
    }
    const filePath = await createCsv(dataId)

    let data = await Data.findOne({
      where: {
        dataId,
      },
      attribute: [
        'year',
        'campusId',
        'typeId',
      ]
    })
    // send requested output file
    const options = {
      root: '/',
      dotfiles: 'deny',
      headers: {
        'content-type': 'text/csv',
        'Content-Disposition': `attachment;filename=${encodeURIComponent(campusMap[data.typeId]['campus'][data.campusId])}${data.year}.csv`,
      },
    }
    res.sendFile(filePath, options, (err) => {
      if(err){
        err = new Error("sen file failed")
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
    console.log(err)
    if(!err.status){
      err = new Error("Error occurred in downloadCsv.js")
      err.status = 500
    }
    next(err)
  }
})

export default router