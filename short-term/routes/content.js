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
import getContent from 'projectRoot/short-term/models/operations/get-content.js'
import contentUpdate from 'projectRoot/short-term/models/operations/content-update.js'
import contentSave from 'projectRoot/short-term/models/operations/content-save.js'
import contentDelete from 'projectRoot/short-term/models/operations/content-delete.js'
import contentChangeLabel from 'projectRoot/short-term/models/operations/content-change-label.js'
import contentCreate from 'projectRoot/short-term/models/operations/content-create.js'

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
    await contentSave({
      userId: req.session.userId,
      content: req.body.content,
      summary: req.body.summary,
      note: req.body.note,
      title1: req.body.title1,
      title2: req.body.title2,
      title3: req.body.title3,
      title4: req.body.title4,
      pageFrom: req.body.pageFrom,
      pageTo: req.body.pageTo,
      contentId: req.body.contentId,
    })

    res.send('completed')
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
    await contentDelete({contentId: req.body.contentId})
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

    await contentChangeLabel({
      contentId: req.body.contentId,
      aspect: req.body.aspect,
      keypoint: req.body.keypoint,
      method: req.body.method,
    })

    res.send('completed')

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

  if(!Number.isNaN(dataId)){
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
    let data = await getContent(req.query.aspect, req.query.keypoint, req.query.method, res.locals.dataId, -1, 0)

    if(data === 'empty data'){
      res.send('')
      return
    }

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
    let data = await getContent(-1, -1, -1, dataId, 0, 1)

    if(data === 'empty data'){
      res.send('')
      return
    }

    res.render('mixins/editnodes/check', {
      contents : data,
    })
  }
  catch (err){
    if(!err.status){
      const err = new Error('get /:dataId/check render failed')
      err.status = 500
    }
    next(err)
  }
})
.post(async(req, res) => {
  try{

    await contentUpdate(req.body.contentId,{
      isChecked: 1,
      isConflicted: 0,
    })

    res.send('completed')
  } catch(err) {
    if(!err.status){
      const err = new Error('post /:dataId/check send failed')
      err.status = 500
    }
    next(err)
  }
})

router.post('/:dataId/add', async(req, res, next)=>{
  try{

    let data = await contentCreate({
      aspect: req.body.aspect,
      keypoint: req.body.keypoint,
      method: req.body.method,
      dataId: res.locals.dataId,
    })

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