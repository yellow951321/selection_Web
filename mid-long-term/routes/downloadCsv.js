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

router.get('/index', async(req, res)=>{
  try {
    const filePath = createCsv(res.locals.dataId)
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
        err = new Error("Error occurred in res.sendFile of mid-long-term/routes/downloadCsv.js", err)
        err.status = 500
        throw err
      }
      else{
        fs.unlink(filePath, (err) => {
          if(err){
            err = new Error("Error occurred in fs.unlink of mid-long-term/routes/downloadCsv.js", err)
            err.status = 500
            throw err
          }
        })
      }
    })
  } catch (err) {
    if(!err.status){
      err = new Error("Error occurred in downloadCsv.js" ,err)
      err.status = 500
    }
    next(err)
  }
})

export default router