const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const fs = require('fs')
const User = require('../../../models/mariadb/User/schema')
const OP = require('./fileOp')

const { map, getFromWord, getFromNum, } = require('../../../data/operation/mapping')
const { findYear, findYearById, } = require('../../../models/mariadb/Year/op')
const { findCampus, findCampusById, } = require('../../../models/mariadb/Campus/op')
const { insertDimensionByCampusId, findDimension, } = require('../../../models/mariadb/Dimension/op')
const { insertItemByDimensionId, findItem, } = require('../../../models/mariadb/Item/op')
const { insertDetailByItemId, findDetail, } = require('../../../models/mariadb/Detail/op')
const { findContentAll, insertContentByDetailId, updateContentById, deleteContentById, } = require('../../../models/mariadb/Content/op')

router.get('/filter', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let year_id = (await findYear(req.session.userId, req.query.year)).year_id
    let campus_id = (await findCampus(year_id, getFromWord(map, {campus: req.query.campus, type: req.query.type, }), getFromWord(map, {type: req.query.type, }))).campus_id
    let dimension_id = (await insertDimensionByCampusId(campus_id, getFromWord(map, {dimension: req.query.dimension, }))()).dimension_id
    let item_id = (await insertItemByDimensionId(dimension_id, getFromWord(map, {item: req.query.item, }))()).item_id
    let detail_id = (await insertDetailByItemId(item_id, getFromWord(map, {detail: req.query.detail, }))()).detail_id

    let context = await findContentAll(detail_id)
    context = context.map(val => {
      return {
        page: {
          start: val.content_start,
          end: val.content_end,
        },
        title: val.content_title,
        content: val.content_content,
        index: val.content_id,
      }
    })

    res.render('manage/component/filter', {
      GLOBAL :{
        contents : context,
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
        user_id:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let year_id = (await findYear(req.session.userId, req.body.year)).year_id
    let campus_id = (await findCampus(year_id, getFromWord(map, {campus: req.body.campus, type: req.body.type, }), getFromWord(map, {type: req.body.type, }))).campus_id
    let dimension_id = (await findDimension(campus_id, getFromWord(map, {dimension: req.body.dimension, }))).dimension_id
    let item_id = (await findItem(dimension_id, getFromWord(map, {item: req.body.item, }))).item_id
    let detail_id = (await findDetail(item_id, getFromWord(map, {detail: req.body.detail, }))).detail_id

    let content = await insertContentByDetailId(detail_id, 1, 1, '', '')
    res.render('manage/component/newEdit', {
      GLOBAL : {
        index : content.content_id,
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
        user_id:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user

    await updateContentById(req.body.content_id, req.body.page.start, req.body.page.end, req.body.title, req.body.content)

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
        user_id:req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let message = await deleteContentById(req.body.content_id)

    res.status(200).send(message)
    console.log('Deletion operation has been finished')
  }
  catch (err){
    console.log(err.message)
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.get('/:year/:type/:campus/:dimension/:item/:detail_word',async (req,res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id: req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user

    // let dimension_id = (await findDimension(req.params.campus, getFromWord(map, {dimension: req.params.dimension, }))).dimension_id
    // let item_id = (await findItem(dimension_id, getFromWord(map, {item: req.params.item, }))).item_id
    // let detail_id = (await findDetail(item_id, getFromWord(map, {detail: req.params.detail_word, }))).detail_id

    let { year } = (await findYearById(req.params.year)).dataValues

    let { campus_name } = (await findCampusById(req.params.campus)).dataValues
    let campus_word = getFromNum({campus: campus_name, type: req.params.type})

    res.render('manage/edit',{
      GLOBAL :{
        id : req.session.userId,
        user : dataValues.user_name,
        year : year,
        type : res.locals.type,
        campus : campus_word,
        dimension : req.params.dimension,
        item : req.params.item,
        detail : req.params.detail
      }
    })
  }
  catch(err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router