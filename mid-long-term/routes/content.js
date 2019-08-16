import express from 'express'
import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import contentUpdate from 'projectRoot/mid-long-term/models/operations/content-update.js'
import contentSave from 'projectRoot/mid-long-term/models/operations/content-save.js'
import contentDelete from 'projectRoot/mid-long-term/models/operations/content-delete.js'
import contentChangeLabel from 'projectRoot/mid-long-term/models/operations/content-change-label.js'
import contentCreate from 'projectRoot/mid-long-term/models/operations/content-create.js'

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
    await contentSave({
      userId: Number(req.session.userId),
      content: req.body.content,
      summary: req.body.summary,
      note: req.body.note,
      title1: req.body.title1,
      title2: req.body.title2,
      title3: req.body.title3,
      title4: req.body.title4,
      pageFrom: Number(req.body.pageFrom),
      pageTo: Number(req.body.pageTo),
      contentId: Number(req.body.contentId),
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
      err = new Error('change failed')
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
    let data = await getContent(Number(req.query.aspect), Number(req.query.keypoint), Number(req.query.method), Number(res.locals.dataId), -1, 0)

    if(data === 'empty data'){
      res.send('')
      return
    }

    res.render('mixins/editnodes/own', {
      contents : data,
    })
  }
  catch (err){
<<<<<<< HEAD
    if(typeof err.status !== 'number'){
=======
    console.log(err)
    if(!err.status){
>>>>>>> feature-backend
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