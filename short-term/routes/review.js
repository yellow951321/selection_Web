import express from 'express'
import Content from 'projectRoot/short-term/models/schemas/Content.js'
import Data from 'projectRoot/short-term/models/schemas/Data.js'
import User from 'projectRoot/auth/models/schemas/user.js'
import getContent from 'projectRoot/short-term/models/operations/get-content.js'
import { shortTermFromNumber } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

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
      ],
    })
    let newData = await data.update({
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
      ],
    })
    let conflictedAspect = Number(req.body.conflictedAspect)
    let conflictedKeypoint = Number(req.body.conflictedKeypoint)
    let conflictedMethod = Number(req.body.conflictedMethod)

    let newData = await data.update({
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
    if(Number.isNaN(dataId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

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
    // let data = await Content.findAll({
    //   where: {
    //     dataId: res.locals.dataId,
    //   },
    //   attributes: [
    //     'contentId',
    //     'dataId',
    //     'title1',
    //     'title2',
    //     'title3',
    //     'title4',
    //     'note',
    //     'content',
    //     'pageFrom',
    //     'pageTo',
    //     'aspect',
    //     'keypoint',
    //     'method',
    //     'isChecked',
    //     'conflictedAspect',
    //     'conflictedKeypoint',
    //     'conflictedMethod',
    //     'reviewerId',
    //     'updateTime',
    //   ],
    // })

    // data = await Promise.all(data.map(async(data) => {
    //   let temp = data.dataValues
    //   temp.method = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method}).method
    //   temp.keypoint = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint}).keypoint
    //   temp.aspect = shortTermFromNumber({aspect: temp.aspect }).aspect

    //   temp.conflictedMethod = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod}).method
    //   temp.conflictedKeypoint = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint}).keypoint
    //   temp.conflictedAspect = shortTermFromNumber({aspect: temp.conflictedAspect}).aspect
    //   if(typeof temp.reviewerId === 'number'){
    //     temp.reviewerId = await User.findOne({
    //       where: {
    //         userId: temp.reviewerId,
    //       },
    //     }).account
    //   }
    //   return temp
    // }))
    let typeName = campusMap[checkData.typeId].type
    let campusName = campusMap[checkData.typeId]['campus'][checkData.campusId]

    res.render('review.pug', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '短程計畫',
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
      // contents: data,
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
    if(Number.isNaN(aspect)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

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
    if(Number(req.query.isChecked) === 1){
      data = await getContent(aspect, keypoint, method, dataId, 1)
    }
    else{
      data = await getContent(aspect, keypoint, method, dataId, 0)
    }
    if(data.length === 0 || typeof data === 'null'){
      res.send('')
      return
    }

    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues
      temp.method = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method}).method
      temp.keypoint = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint}).keypoint
      temp.aspect = shortTermFromNumber({aspect: temp.aspect }).aspect

      temp.conflictedMethod = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod}).method
      temp.conflictedKeypoint = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint}).keypoint
      temp.conflictedAspect = shortTermFromNumber({aspect: temp.conflictedAspect}).aspect
      if(typeof temp.reviewerId === 'number' && temp.reviewerId !== 0){
        temp.reviewerId = await User.findOne({
          where: {
            userId: temp.reviewerId,
          },
        })
        temp.reviewerId = temp.reviewerId.account
      }
      return temp
    }))

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