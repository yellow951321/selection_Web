/**
 * @file The review route for reviewer
 * @module reviewRouter
 * @requires express
 * @requires 'projectRoot/mid-long-term/models/operations/get-content.js'
 * @requires 'lib/static/javascripts/mapping/campus.js'
 * @requires 'projectRoot/mid-long-term/models/operations/content-update.js'
 * @requires 'projectRoot/mid-long-term/models/operations/content-auth.js'
 */
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


/**
 * It will update the status of the `isChecked` of the content
 * @name check
 * @inner
 * @function
 */
router.post('/check', async(req, res, next) => {
  try{
    /**
     * Update the value of the column, `isChecked` to `1`
     */
    let newData = await contentUpdate(Number(req.body.contentId), {
      reviewerId: Number(req.session.userId),
      isChecked: 1,
    })
    /**
     * If `newData` is not `undefined` or `null`,
     * sent a 'completed' string back.
     * Otherwise, throw an error.
     */
    if(newData){
      res.send('completed')
    }
    else{
      throw new Error('failed')
    }
  }
  catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      const err = new Error('ckeck failed')
      err.status = 500
    }
    next(err)
  }
})

/**
 * It will update the status of
 * `isConflicted`,
 * `conflictedAspect`,
 * `conflictedKeypoint`,
 * `conflictedMethod`,
 * of the content
 * @name conflict
 * @inner
 * @function
 */
router.post('/conflict', async(req, res, next) => {
  try{
    /**
     * Update the value of the columns,
     * `conflictedAspect`,
     * `conflictedKeypoint`,
     * `conflictedMethod`,
     * `isConflicted`,
     * `reviewerId`
     */
    let newData = await contentUpdate(Number(req.body.contentId), {
      conflictedAspect: Number(req.body.conflictedAspect),
      conflictedKeypoint: Number(req.body.conflictedKeypoint),
      conflictedMethod: Number(req.body.conflictedMethod),
      isConflicted: 1,
      reviewerId: req.session.userId,
    })
    /**
     * If `newData` is not `undefined` or `null`,
     * sent a 'completed' string back.
     * Otherwise, throw an error.
     */
    if(newData){
      res.send('completed')
    }
    else{
      throw new Error('failed')
    }
  }
  catch(err){
     /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      const err = new Error('conflict failed')
      err.status = 500
    }
    next(err)
  }
})
/**
 * Check whether `dataId` is owned by the user,`userId` or not.
 * @name authRouter
 * @inner
 * @function
 */
router.use('/:dataId', async (req, res, next) => {
  try{
    let result = await contentAuth({
      dataId: Number(req.params.dataId),
      userId: req.session.userId,
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
    if(err.status === 404)
      res.redirect('/auth/channel')
    if(typeof err.status !== 'number'){
      err = new Error('invalid argument')
      err.status = 400
    }
    next(err)
  }
})

/**
 * Render the `review.pug` back to the client.
 * @name reviewPugRouter
 * @inner
 * @function
 */
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

/**
 * Render the `reivew.pug` with the desired data
 * respected to `aspect`, `keypoint`, `method`.
 * @name reviewFilterRouter
 * @inner
 * @function
 */
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