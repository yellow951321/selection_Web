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
const User = require('./../../../models/User/user')
const OP = require('./fileOp')

router.post('/filter',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
    const path = OP.pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
     var data =  fs.readFileSync(path,'utf-8')
      data = JSON.parse(data)
      const context = OP.objToNode({
        dimension : req.body.info.dimension,
        item : req.body.info.item,
        detail : req.body.info.detail
      },data)

      res.render('manage/filter',{contents :context})
  }
  catch (err){
    console.log(err)
      res.status(409).send('Conflict')
  }
})

router.post('/add',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
    const path = OP.pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
      var data =  fs.readFileSync(path,'utf-8')
        data = JSON.parse(data)

    let t = new OP.ContentSchema({start:1,end:1},'','')
    data[req.body.info.dimension][req.body.info.item][req.body.info.detail].push(t)
    let length = data[req.body.info.dimension][req.body.info.item][req.body.info.detail].length-1
    console.log(length)
    await fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
      if(err) throw err
    })

    res.render('manage/newEdit',{index : length})
  }
  catch (err){
    console.log(err)
      res.status(409).send('Conflict')
  }
})

router.post('/save',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const year = req.body.info.year
    const type = req.body.info.type
    const campus = req.body.info.campus
    const dimension = req.body.info.dimension
    const item = req.body.info.item
    const detail = req.body.info.detail
    const index = req.body.index
    const path = OP.pathGen(doc.username,year,type,campus)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,year,type)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)
    console.log(req.body.data)
    if(isExist)
      var modData = await OP.nodeToObj(path,
        {
          dimension :dimension,
          item : item,
          detail : detail,
          index : index
        },{
          page : req.body.page,
          title : req.body.title,
          data : req.body.data
        })
    console.log(modData[dimension][item][detail])
    await fs.writeFile(path,JSON.stringify(modData,null,2),(err)=>{
      if(err) throw err
    })

    res.status(200).send('OK')
  }
  catch (err){
    console.log(err)
      res.status(409).send('Conflict')
  }
})

router.post('delete',async (req,res)=>{
  try{
    const doc = await OP.findUsernameAsync(User,req.session.userId)
    const path = OP.pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)

    const isExist = await checkFileAsync(path,pathWithoutCampus)

    if(isExist)
      var data =  fs.readFileSync(path,'utf-8')
      data = JSON.parse(data)

    let deleteObj = data[req.body.info.dimension][req.body.info.item][req.body.info.detail]
    if(deletObj instanceof Array){
      data[req.body.info.dimension][req.body.info.item][req.body.info.detail] = deleteObj.filter((element,index)=>{
        return index != req.body.index
      })
    }

    await fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
      if(err) throw err
    })
    res.status(200).send('OK')
    console.log('Deletion operation has been finished')
  }
  catch (err){
    console.log(err)
    res.status(409).send('Conflict')
  }
})

module.exports = router