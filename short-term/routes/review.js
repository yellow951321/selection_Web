import express from 'express'
import getContent from 'projectRoot/short-term/models/operations/get-content.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import contentUpdate from 'projectRoot/short-term/models/operations/content-update.js'
import contentAuth from 'projectRoot/short-term/models/operations/content-auth.js'

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
    let newData = await contentUpdate(Number(req.body.contentId), {
      reviewerId: Number(req.session.userId),
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
    let newData = await contentUpdate(Number(req.body.contentId), {
      conflictedAspect: Number(req.body.conflictedAspect),
      conflictedKeypoint: Number(req.body.conflictedKeypoint),
      conflictedMethod: Number(req.body.conflictedMethod),
      isConflicted: 1,
      reviewerId: Number(req.session.userId),
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
      dataId: Number(req.params.dataId),
      userId: Number(req.session.userId),
    })
    if(result === 'empty data'){
      res.redirect('/auth/channel')
      return
    }

    if(result === 'as an editor'){
      res.redirect(`/short-term/data/${req.params.dataId}/edit`)
      return
    }

    res.locals.year = result.info.year
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
          id: 'short-term',
          name: '計畫申請書',
        },
        {
          id: res.locals.yearId,
          name: res.locals.yearId,
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
      year: res.locals.yearId,
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
    data = await getContent(Number(req.query.aspect), Number(req.query.keypoint), Number(req.query.method), Number(req.params.dataId), Number(req.query.isChecked))

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