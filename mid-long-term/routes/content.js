import express from 'express'
import Content from 'projectRoot/mid-long-term/models/schemas/Content'
import User from 'projectRoot/auth/models/schemas/user.js'
import {map, getFromNum, getFromWord, } from 'projectRoot/data/operation/mapping'


const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res) => {
})

router.get('/filter', async(req, res)=>{
  try{

    let aspect = getFromWord(map, { dimension: req.query.dimension, })
    let keypoint = getFromWord(map, {item: req.query.item, })
    let method = getFromWord(map, { detail: req.query.detail, })
    let data = await Content.findAll({
      where: {
        dataId: res.locals.dataId,
        aspect,
        keypoint,
        method,
      },
      attributes: [
        'contentId',
        'title1',
        'title2',
        'title3',
        'title4',
        'content',
        'summary',
        'note',
        'pageFrom',
        'pageTo',
        'aspect',
        'keypoint',
        'method',
        'isChecked',
        'reviewerId',
        'isConflicted',
        'updateTime',
        'dataId',
      ],
    })
    if(data === []){
      res.send('empty')
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues
      if(temp.reviewerId){
        temp.reviewerId = await User.findOne({
          where: {
            userId: temp.reviewerId,
          },
        })
        temp.reviewerId = temp.reviewerId.dataValues.account
      }
      return temp
    }))
    res.render('mixins/editnodes/own', {
      contents : data,
    })
  }
  catch (err){
	  if(!err.status){
      err = new Error("Error occurred in filter of mid-long-term/routes/content.js", err)
      err.status = 500
    }
    next(err)
  }
})

router.get('/check', async(req, res) => {
  try{
    let data = await Content.findAll({
      where: {
        dataId: res.locals.dataId,
        isConflicted: 1,
        isChecked: 0,
      },
      attributes:[
        'content',
        'summary',
        'note',
        'reviewerId',
        'title1',
        'title2',
        'title3',
        'title4',
        'pageFrom',
        'pageTo',
        'contentId',
        'conflictedAspect',
        'conflictedKeypoint',
        'conflictedMethod',
      ],
    })
    if(data === []){
      res.send('empty')
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues
      temp.aspect = getFromNum(map, {dimension: temp.aspect, })
      temp.keypoint = getFromNum(map, {item: temp.keypoint, })
      temp.method = getFromNum(map, {detail: temp.method, })

      temp.conflictedAspect = getFromNum(map, {dimension: temp.conflictedAspect, })
      temp.conflictedKeypoint = getFromNum(map, {item: temp.conflictedKeypoint, })
      temp.conflictedMethod = getFromNum(map, {detail: temp.conflictedMethod, })
      return temp
    }))
    res.render('mixins/editnodes/check', {
      contents : data,
    })
  }
  catch (err){
	  if(!err.status){
      err = new Error("Error occurred in check route of mid-long-term/routes/content.js", err)
      err.status = 500
    }
    next(err)
  }
})

router.post('/check', async(req, res) => {
  try{
    let data = await Content.findOne({
      where:{
        contentId: req.body.contentId,
      },
      attributes:[
        'contentId',
        'isChecked',
      ],
    })
    let savedData = await data.update({
      isChecked: 1,
      isConflicted: 0,
    })
    if(savedData){
      res.send('completed')
    }
    else{
      let err = new Error('save failed')
      err.status = 404
      throw err
    }
  } catch(err) {
    if(!err.status) {
      err = new Error("Error occurred in mid-long-term/routes/content.js", err)
      err.status = 500
    }
    next(err)
  }
})

router.post('/change', async(req, res) => {
  try{
    let data = await Content.findOne({
      where:{
        contentId: req.body.contentId,
      },
      attributes:[
        'contentId',
      ],
    })
    let aspect = getFromWord(map, { dimension: req.body.aspect, })
    let keypoint = getFromWord(map, {item: req.body.keypoint, })
    let method = getFromWord(map, { detail: req.body.method, })

    let savedData = await data.update({
      isChecked: 1,
      isConflicted: 0,
      aspect,
      keypoint,
      method,
      conflictedAspect: null,
      conflictedKeypoint: null,
      conflictedMethod: null,
    })
    if(savedData){
      res.send('completed')
    }
    else{
      throw new Error('save failed')
    }
  } catch(err) {
    console.log(err)
    res.sendStatus(404)
  }
})

router.post('/add', async(req, res)=>{
  try{
    let aspect = getFromWord(map, { dimension: req.body.dimension, })
    let keypoint = getFromWord(map, {item: req.body.item, })
    let method = getFromWord(map, { detail: req.body.detail, })

    let data = await Content.create({
      dataId: res.locals.dataId,
      title1: '',
      title2: '',
      title3: '',
      title4: '',
      content: '',
      pageFrom: 1,
      pageTo: 1,
      aspect,
      keypoint,
      method,
      isChecked: 0,
      reviewerId: 0,
      isConflicted: 0,
      updateTime: Date.now(),
    })
    res.render('mixins/editnodes/newedit', {
      index: data.dataValues.contentId,
    })
  }catch(err) {
    res.status(404)
  }
})

router.post('/save', async(req, res)=>{
  try{
    // @TODO check if this user have privilige to modify

    let data = await Content.findOne({
      where:{
        contentId: req.body.contentId,
      },
      attributes:[
        'contentId',
      ],
    })
    let savedData = await data.update({
      content: req.body.content,
      summary: req.body.summary,
      note: req.body.note,
      reviewerId: req.body.auditor,
      title1: req.body.title1,
      title2: req.body.title2,
      title3: req.body.title3,
      title4: req.body.title4,
      pageFrom: req.body.page.start,
      pageTo: req.body.page.end,
      contentId: req.body.contentId,
      isChecked: 0,
      isConflicted: 0,
      conflictedAspect: null,
      conflictedKeypoint: null,
      conflictedMethod: null,
    })
    if(savedData){
      res.send('completed')
    }
    else{
      throw new Error('save failed')
    }
  } catch(err) {
    res.status(404)
  }
})


router.delete('/delete', async(req, res)=>{
  try{
    let result = await Content.destroy({
      where:{
        contentId: req.body.contentId,
      },
    })
    res.send('completed')
  }
  catch(err){
    res.status(404)
  }
})

export default router