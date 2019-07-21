/**
 * @namespace shortTermRoute
 */

// /**
//  * @file
//  * @module app/content
//  * @requires express
//  * @requires module:Content
//  * @requires 'projectRoot/short-term/models/schemas/Data.js'
//  * @requires 'projectRoot/auth/models/schemas/user.js'
//  * @requires module:get-content
//  * @requires 'projectRoot/lib/static/javascripts/mapping/label.js'
//  */
//import express module
import express from 'express'
// import Content module
import Content from 'projectRoot/short-term/models/schemas/Content.js'
import dataSave from 'projectRoot/short-term/models/operations/data-save.js'
import getContent from 'projectRoot/short-term/models/operations/get-content.js'
import labelFromNumber from 'projectRoot/short-term/models/operations/label-from-number.js'

/**
 * Express route class
 * @name content/Router
 * @function router
 * @param {object} [options] - The custimized setting of Router()
 * @inner
 * @see https://expressjs.com/
 */
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
/**
 * set A '/index' route, method GET
 * @name post/save
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @thorws - Throws an error if any error occurred in here
 */
router.post('/save', async(req, res, next)=>{
  try{
    /**
     *
     */
    let contentId = Number(req.body.contentId)
    if(Number.isNaN(contentId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    let savedContent = await dataSave({
      userId: req.session.userId,
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
    })
    if(savedContent){
      res.send('completed')
    }
    else{
      throw new Error('save failed')
    }
  } catch(err) {
    if(!err.status){
      err = new Error('save failed')
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
      err = new Error('delete failed')
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
    let isChecked = Number(req.body.isChecked)

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
        'isConflicted'
      ],
    })

    // check if the change label request is from the conflicted status or edit status
    // if it's change status to checked
    if(data.isConflicted === 1)
      isChecked = 1

    let savedData = await data.update({
      isChecked,
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

router.get('/:dataId/filter', async(req, res, next)=>{
  try{
    let aspect = Number(req.query.aspect);
    let keypoint = Number(req.query.keypoint);
    let method = Number(req.query.method);

    if(Number.isNaN(aspect)){
      const err = new Error('invalid argument');
      err.status = 400
      throw err
    }
    let data = await getContent(aspect, keypoint, method, res.locals.dataId, -1, 0)

    if(data.length === 0 || typeof data === 'null'){
      res.send('')
      return
    }

    data = await labelFromNumber(data)
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
    let data = await getContent(-1, -1, -1, res.locals.dataId, 0, 1)
    if(data.length === 0){
      res.send('')
      return
    }
    data = await labelFromNumber(data)
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
      let err = new Error('save failed')
      err.status = 500
      throw err
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
    data = await labelFromNumber(data)
    res.render('mixins/editnodes/newedit', {
      content: {
        aspect: data.aspect,
        keypoint: data.keypoint,
        method: data.method,
        contentId: data.contentId,
      },
    })
  }catch(err) {
    if(!err.status){
      err = new Error('add content failed')
      err.status = 500
    }
    next(err)
  }
})
export default router