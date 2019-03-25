const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const { User, Data, Content, } = require('../../../models/association')
const { map, getFromWord, } = require('../../../data/operation/mapping')
const { findOneGroupContents,
  insertContent,
  updateContent,
  deleteContent, } = require('../../../models/operation/contents')

router.get('/filter', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let typeId = getFromWord(map, { type: req.query.type, })
    let campusId = getFromWord(map, { campus: req.query.campus, type: req.query.type, })
    let aspect = getFromWord(map, { dimension: req.query.dimension, })
    let keypoint = getFromWord(map, {item: req.query.item, })
    let method = getFromWord(map, { detail: req.query.detail, })

    let data = await findOneGroupContents({
      userId: req.session.userId,
      year: req.query.year,
      typeId,
      campusId,
    }, {
      aspect,
      keypoint,
      method,
    })
    data = data.map(contents => contents.dataValues)
    res.render('manage/component/filter', {
      GLOBAL :{
        contents : data,
      },
    })
  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.post('/add', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    let typeId = getFromWord(map, { type: req.body.type, })
    let campusId = getFromWord(map, { campus: req.body.campus, type: req.body.type, })
    let aspect = getFromWord(map, { dimension: req.body.dimension, })
    let keypoint = getFromWord(map, {item: req.body.item, })
    let method = getFromWord(map, { detail: req.body.detail, })
    let data = await Data.findOne({
      where:{
        userId: req.body.id,
        year: req.body.year,
        type: typeId,
        campus: campusId,
      },
      attributes: ['dataId', ],
    })

    let {dataId, } = data.dataValues
    let newContent = await insertContent({
      content: '',
      title: '',
      summary: '',
      pageStart: '',
      pageEnd: '',
      aspect,
      keypoint,
      method,
      dataId,
    })
    let { contentId, } = newContent.dataValues
    res.render('manage/component/newEdit', {
      GLOBAL : {
        index : contentId,
      },
    })
  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.post('/save', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user
    await updateContent({
      contentId: req.body.contentId,
      content: req.body.content,
      title: req.body.title,
      pageStart: req.body.page.start,
      pageEnd: req.body.page.end,
      summary: req.body.summary,
    })

    res.status(200).send('OK')
  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.delete('/delete', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let message = await deleteContent(req.body.contentId)

    res.status(200).send(message)
  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router