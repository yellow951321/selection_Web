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
const User = require('../../../models/User/schema')
const {findUsernameAsync} = require('../../../models/User/op')
const OP = require('./fileOp')

router.post('/filter',async (req,res)=>{
  try{
    const doc = await findUsernameAsync(User,req.session.userId)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.year,req.body.type)
    const path = OP.pathGen(doc.username,req.body.year,req.body.type,req.body.campus)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
     var data =  fs.readFileSync(path,'utf-8')
      data = JSON.parse(data)
      const context = OP.objToNode({
        dimension : req.body.dimension,
        item : req.body.item,
        detail : req.body.detail
      },data)

      res.render('manage/component/filter',{
        GLOBAL :{
          contents : context
        }
      })
  }
  catch (err){
    console.log(err)
      res.status(409).send('Conflict')
  }
})

router.post('/add',async (req,res)=>{
  try{
    const doc = await findUsernameAsync(User,req.session.userId)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.year,req.body.type)
    const path = OP.pathGen(doc.username,req.body.year,req.body.type,req.body.campus)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
      var data =  fs.readFileSync(path,'utf-8')
        data = JSON.parse(data)

    let t = new OP.ContentSchema({start:1,end:1},'','')
    data[req.body.dimension][req.body.item][req.body.detail].push(t)
    let length = data[req.body.dimension][req.body.item][req.body.detail].length-1
    console.log(length)
    await fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
      if(err) throw err
    })

    res.render('manage/component/newEdit',{
      GLOBAL : {
        index : length
      }
    })
  }
  catch (err){
    console.log(err)
      res.status(409).send('Conflict')
  }
})

router.post('/save',async (req,res)=>{
  try{
    const doc = await findUsernameAsync(User,req.session.userId)
    const year = req.body.year
    const type = req.body.type
    const campus = req.body.campus
    const dimension = req.body.dimension
    const item = req.body.item
    const detail = req.body.detail
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

router.post('/delete',async (req,res)=>{
  try{
    const doc = await findUsernameAsync(User,req.session.userId)
    const path = OP.pathGen(doc.username,req.body.year,req.body.type,req.body.campus)
    const pathWithoutCampus = OP.pathGenWithoutCampus(doc.username,req.body.year,req.body.type)

    const isExist = await OP.checkFileAsync(path,pathWithoutCampus)

    if(isExist)
      var data =  fs.readFileSync(path,'utf-8')
      data = JSON.parse(data)

    let deleteObj = data[req.body.dimension][req.body.item][req.body.detail]
    if(deleteObj instanceof Array){
      data[req.body.dimension][req.body.item][req.body.detail] = deleteObj.filter((element,index)=>{
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