import express from 'express'
import fs from 'fs'
import createCsv from 'mid-long-term/models/operations/download-csv.js'

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

    // send requested output file
    const options = {
      root: '/',
      dotfiles: 'deny',
      headers: {
        'content-type': 'text/csv',
        'Content-Disposition': `attachment;filename=${encodeURIComponent(req.params.campusName)}.csv`,
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
    if(!err.status){
      err = new Error("Error occurred in downloadCsv.js")
      err.status = 500
    }
    next(err)
  }
})

export default router