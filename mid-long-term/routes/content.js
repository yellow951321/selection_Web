import express from 'express'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
import dataSave from 'projectRoot/mid-long-term/models/operations/data-save.js'
import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'
import numberValid from 'projectRoot/lib/static/javascripts/number-valid.js'
import contentUpdate from 'projectRoot/mid-long-term/models/operations/content-update.js'

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

    numberValid([contentId])

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
      throw new Error('mid-long-term content save router error')
    }
  } catch(err) {
    if(!err.status){
      err = new Error('mid-long-term content save router error')
      err.status = 500
    }
    next(err)
  }
})

router.delete('/delete', async(req, res)=>{
  try{
    let contentId = Number(req.body.contentId)
    numberValid([contentId])

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

    numberValid([contentId, aspect, keypoint, method, isChecked])

    let data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
        'isConflicted',
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
      err = new Error('filter failed2')
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

    numberValid([aspect])

    let data = await getContent(aspect, keypoint, method, res.locals.dataId, -1, 0)

    if(data.length === 0 || typeof data === 'null'){
      res.send('')
      return
    }

    data = await labelFromNumber(data);
    res.render('mixins/editnodes/own', {
      contents : data,
    })
  }
  catch (err){
    if(!err.status){
      err = new Error('filter failed1')
      err.status = 500
    }
    next(err)
  }
})

router.route('/:dataId/check')
.get(async(req, res, next) => {
  try{
    let dataId = Number(res.locals.dataId)
    
    numberValid([dataId])

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
   
    numberValid([contentId])

    let savedData = await contentUpdate(contentId,{
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

    numberValid([aspect, keypoint, method])

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

    data = await labelFromNumber(data);
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