import express from 'express'
import Content from 'projectRoot/mid-long-term/models/schemas/Content'
import Data from 'projectRoot/mid-long-term/models/schemas/Data'
import User from 'projectRoot/auth/models/schemas/user.js'
import { midLongTermFromNumber } from 'projectRoot/lib/static/javascripts/mapping/label.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/save', async(req, res, next)=>{
  try{
    let contentId = Number(req.body.contentId)
    if(Number.isNaN(contentId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    let content = await Content.findOne({
      where:{
        contentId,
      },
      attributes: [
        'contentId',
        'dataId'
      ],
    })
    // privillige check
    let data = await Data.findOne({
      where:{
        dataId: content.dataId
      },
      attributes: [
        'userId',
      ]
    })

    if(data.userId !== Number(req.session.userId)){
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }

    let savedContent = await content.update({
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
    if(savedContent){
      res.send('completed')
    }
    else{
      throw new Error('save failed')
    }
  } catch(err) {
    if(!err.status){
      err = new Error('filter failed')
      err.status = 500
    }
    next(err)
  }
})

router.delete('/delete', async(req, res)=>{
  try{
    let contentId = Number(req.body.contentId)
    if(Number.isNaN(contentId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    await Content.destroy({
      where:{
        contentId,
      },
    })
    res.send('completed')
  }
  catch(err){
    if(!err.status){
      err = new Error('filter failed')
      err.status = 500
    }
    next(err)
  }
})

router.post('/change', async(req, res) => {
  try{
    let contentId = Number(req.body.contentId)
    let aspect = Number(req.body.aspect)
    let keypoint = Number(req.body.keypoint)
    let method = Number(req.body.method)

    if(Number.isNaN(contentId) || Number.isNaN(aspect) || Number.isNaN(keypoint) || Number.isNaN(method)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    let data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
      ],
    })

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
    if(!err.status){
      err = new Error('filter failed')
      err.status = 500
    }
    next(err)
  }
})

router.use('/:dataId', (req, res, next) => {
  let dataId = Number(req.params.dataId)
  if(typeof dataId === 'number'){
    res.locals.dataId = dataId
    next()
  }
  else{
    const err = new Error('invalid argument')
    err.status = 400
    next(err)
  }
})

router.get('/:dataId/filter', async(req, res)=>{
  try{
    let aspect = req.query.aspect;
    let keypoint = req.query.keypoint;
    let method = req.query.method;

    if(Number.isNaN(aspect) || Number.isNaN(keypoint) || Number.isNaN(method)){
      const err = new Error('invalid argument');
      err.status = 400
      throw err
    }

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
      err = new Error('filter failed')
      err.status = 500
    }
    next(err)
  }
})

router.route('/:dataId/check')
.get(async(req, res, next) => {
  try{
    let dataId = Number(res.locals.dataId)
    if(Number.isNaN(dataId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
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
      temp.conflictedMethod = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod}).method
      temp.conflictedKeypoint = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint}).keypoint
      temp.conflictedAspect = midLongTermFromNumber({aspect: temp.conflictedAspect}).aspect
      return temp
    }))
    res.render('mixins/editnodes/check', {
      contents : data,
    })
  }
  catch (err){
    if(!err.status){
      const err = new Error('enter review page failed')
      err.status = 500
    }
    next(err)
  }
})
.post(async(req, res) => {
  try{
    let contentId = Number(req.body.contentId)
    if(Number.isNaN(contentId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    let data = await Content.findOne({
      where:{
        contentId,
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
      throw new Error('save failed')
    }
  } catch(err) {
    if(!err.status){
      const err = new Error('enter review page failed')
      err.status = 500
    }
    next(err)
  }
})

router.post('/:dataId/add', async(req, res, next)=>{
  try{
    let aspect = req.body.aspect;
    let keypoint = req.body.keypoint;
    let method = req.body.method;

    if(Number.isNaN(aspect) || Number.isNaN(keypoint) || Number.isNaN(method)){
      const err = new Error('invalid argument');
      err.status = 400
      throw err
    }

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
    if(!err.status){
      err = new Error('filter failed')
      err.status = 500
    }
    next(err)
  }
})
export default router