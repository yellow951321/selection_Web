const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const User = require('../../models/mariadb/User/schema')
const { map, getFromNum, findParentByDetail, } = require('../../data/operation/mapping')


router.get('/', async(req, res)=>{
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

    res.render('manage/edit', {
      GLOBAL : {
        id : req.session.userId,
        user : dataValues.user_name,
        year : res.locals.year,
        type : res.locals.type,
        campus : res.locals.campus,
      },
    })
  }
  catch (err){
    res.status(403).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.get('/:detail_num',async (req,res)=>{
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
    console.log()
    const detail_word = getFromNum(map,{
      detail: req.params.detail_num
    })
    console.log(detail_word)
    const { dimension, item, } = findParentByDetail(detail_word)
    console.log({
      GLOBAL: {
        id : req.session.userId,
        user : dataValues.user_name,
        year : res.locals.year,
        type : res.locals.type,
        campus : res.locals.campus,
        dimension : dimension,
        item : item,
        detail : detail_word
      }
    })
    res.render('manage/edit',{
      GLOBAL: {
        id : req.session.userId,
        user : dataValues.user_name,
        year : res.locals.year,
        type : res.locals.type,
        campus : res.locals.campus,
        dimension : dimension,
        item : item,
        detail : detail_word
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