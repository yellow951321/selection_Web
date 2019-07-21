import express from 'express'
import Data from 'projectRoot/short-term/models/schemas/Data.js'
import getContent from 'projectRoot/short-term/models/operations/get-content.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import labelFromNumber from 'projectRoot/short-term/models/operations/label-from-number.js'
import numberValid from 'projectRoot/lib/static/javascripts/number-valid.js'
import contentUpdate from 'projectRoot/short-term/models/operations/content-update.js'

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
    let contentId = Number(req.body.contentId)

    numberValid([contentId])

    let newData = await contentUpdate(contentId, {
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
    let contentId = Number(req.body.contentId)
    let conflictedAspect = Number(req.body.conflictedAspect)
    let conflictedKeypoint = Number(req.body.conflictedKeypoint)
    let conflictedMethod = Number(req.body.conflictedMethod)

    numberValid([contentId, conflictedAspect, conflictedKeypoint, conflictedMethod])

    let newData = await contentUpdate(contentId, {
      conflictedAspect,
      conflictedKeypoint,
      conflictedMethod,
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

router.get('/:dataId/index', async(req, res, next) => {
  try{
    let dataId = Number(res.locals.dataId)

    numberValid([contentId])

    let checkData = await Data.findOne({
      where:{
        dataId,
      },
      attributes: [
        'dataId',
        'typeId',
        'campusId',
        'year',
      ],
    })

    if(checkData === null){
      res.redirect('/auth/channel')
      return
    }

    if(checkData.dataValues.userId === req.session.userId){
      res.redirect(`/short-term/data/${dataId}/edit`)
      return
    }
    let typeName = campusMap[checkData.typeId].type
    let campusName = campusMap[checkData.typeId]['campus'][checkData.campusId]

    res.render('review.pug', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '計畫申請書',
        },
        {
          id: checkData.year,
          name: checkData.year,
        },
        {
          id: checkData.typeId,
          name: typeName
        },
        {
          id: checkData.campusId,
          name: campusName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
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
    let dataId = Number(res.locals.dataId)
    let aspect = Number(req.query.aspect);
    let keypoint = Number(req.query.keypoint);
    let method = Number(req.query.method);

    numberValid([contentId])

    let checkData = await Data.findOne({
      where:{
        dataId,
      },
      attributes: [
        'dataId',
        'typeId',
        'campusId'
      ],
    })

    if(checkData === null){
      res.redirect('/auth/channel')
      return
    }

    if(checkData.dataValues.userId === req.session.userId){
      res.redirect(`/short-term/data/${dataId}/edit`)
      return
    }

    let data;
    
    data = await getContent(aspect, keypoint, method, dataId, Number(req.query.isChecked), 0)

    if(data.length === 0 || typeof data === 'null'){
      res.send('')
      return
    }

    data = await labelFromNumber(data)

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