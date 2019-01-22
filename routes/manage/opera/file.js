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
const User = require('../../../models/mariadb/User/schema')
const OP = require('./fileOp')
const {Schema} = require('./../../../config')

router.post('/add', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id:req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues} = user

    const pathWithoutCampus = OP.pathGenWithoutCampus(dataValues.user_name, req.body.year, req.body.type)
    const path = OP.pathGen(dataValues.user_name, req.body.year, req.body.type, req.body.campus)

    const isExist = await OP.checkFileAsync(path, pathWithoutCampus)

    if(isExist)
      await new Promise((res, rej)=>{
        fs.copyFile(Schema, path, (err)=>{
          if(err) rej(err)
          else res()
        })
      })
    // @todo remove dependency
    const data = await new Promise((res, rej)=>{
      fs.readFile(path, (err, data)=>{
        if(err) rej(err)
        if(data){
          data = JSON.parse(data)
          data['年度'] = req.body.year
          data['學校'] = req.body.campus
          data['類型'] = req.body.type
          res(data)
        }
      })
    })

    await new Promise((resolve,reject)=>{
      fs.writeFile(path, JSON.stringify(data, null, 2), (err)=>{
        if(err) reject(err)
        resolve()
      })
    })

    res.redirect(`/man/${req.session.userId}/${req.body.year}/${req.body.type}/${req.body.campus}`)
    console.log('Add operation is finished')

  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.post('/delete', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id:req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues} = user
    const oldPath = OP.pathGen(dataValues.user_name, req.body.year, req.body.type, req.body.campus)
    const newPath = OP.pathGenDeleteName(dataValues.user_name, req.body.year, req.body.type, req.body.campus)

    await new Promise((resolve,reject)=>{
      fs.rename(oldPath, newPath, (err)=>{
        if(err) reject(err)
        resolve()
      })
    })

    res.redirect(`/man/${req.session.userId}/${req.body.year}/${req.body.type}`)
  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router

