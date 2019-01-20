const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const fs = require('fs')
const User = require('../../../models/User/user')
const OP = require('./fileOp')
const {Schema} = require('./../../../config')

router.post('/add',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
    const path = OP.pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
     await new Promise((res,rej)=>{
        fs.copyFile(Schema,path,(err)=>{
          if(err) rej(err)
          else res()
        })
      })
    const data = await new Promise((res,rej)=>{
          fs.readFile(path,(err,data)=>{
            if(err) rej(err)
            if(data){
              data = JSON.parse(data)
              data['年度'] = req.body.info.year
              data['學校'] = req.body.info.campus
              data['類型'] = req.body.info.type
              res(data)
            }
          })
        })

    await fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
      if(err) throw err
    })

    res.send('OK')
    console.log('Add operation is finished')

  }
  catch (err){
    console.log(err)
    res.status(409).send('Conflict')
  }
})

router.post('/delete',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const oldPath = OP.pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
    const newPath = OP.pathGenDeleteName(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)

    await fs.rename(oldPath,newPath,(err)=>{
      if(err) throw err
    })
    res.status(200).send('OK')
  }
  catch (err){
    console.log(err)
    res.status(409).send('Conflict')
  }
})


module.exports = router

