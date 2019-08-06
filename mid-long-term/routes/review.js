import express from 'express'
import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import contentUpdate from 'projectRoot/mid-long-term/models/operations/content-update.js'
import contentAuth from 'projectRoot/mid-long-term/models/operations/content-auth.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/check', async(req, res, next) => {
  try{
    let newData = await contentUpdate(req.body.contentId, {
      reviewerId: req.session.userId,
      isChecked: 1,
    })
    if(newData){
      res.send('completed')
    }
    else{
      throw new Error('failed')
    }
  }
  catch(err){
    if(!err.status){
      const err = new Error('ckeck failed')
      err.status = 500
    }
    next(err)
  }
})

router.post('/conflict', async(req, res, next) => {
  try{
    let newData = await contentUpdate(req.body.contentId, {
      conflictedAspect: req.body.conflictedAspect,
      conflictedKeypoint: req.body.conflictedKeypoint,
      conflictedMethod: req.body.conflictedMethod,
      isConflicted: 1,
      reviewerId: req.session.userId,
    })
    if(newData){
      res.send('completed')
    }
    else{
      throw new Error('failed')
    }
  }
  catch(err){
    if(!err.status){
      const err = new Error('conflict failed')
      err.status = 500
    }
    next(err)
  }
})

router.use('/:dataId', async (req, res, next) => {
  try{
    let result = await contentAuth({
      dataId: req.params.dataId,
      userId: req.session.userId
    })
    if(result === 'empty data'){
      res.redirect('/auth/channel')
      return
    }

    if(result.message === 'as an editor'){
      res.redirect(`/mid-long-term/data/${req.params.dataId}/edit`)
      return
    }

    res.locals.typeId = result.info.typeId
    res.locals.campusId = result.info.campusId
    next()
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('invalid argument')
      err.status = 400
    }
    next(err)
  }
})

router.get('/:dataId/index', async(req, res, next) => {
  try{

    let typeName = campusMap[res.locals.typeId].type
    let campusName = campusMap[res.locals.typeId]['campus'][res.locals.campusId]

    res.render('review.pug', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        {
          id: res.locals.typeId,
          name: typeName
        },
        {
          id: res.locals.campusId,
          name: campusName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      dataId: req.params.dataId,
    })
  }
  catch(err){
    if(!err.status){
      const err = new Error('enter review page failed')
      err.status = 500
    }
    next(err)
  }
})

router.get('/:dataId/filter', async(req, res, next) => {
  try{
    let data;
    data = await getContent(req.query.aspect, req.query.keypoint, req.query.method, req.params.dataId, Number(req.query.isChecked))

    if(data === 'empty data'){
      res.send('')
      return
    }

    res.render('mixins/editnodes/review.pug', {
      contents: data,
    })
  }
  catch(err){
    if(!err.status){
      const err = new Error('get review filter failed')
      err.status = 500
    }
    next(err)
  }
})

export default router