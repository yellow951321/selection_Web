const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const User = require('../../models/newModel/schema/User')
const { map, getFromNum, findParentByDetail, } = require('../../data/operation/mapping')


router.get('/', async(req, res)=>{
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

    res.render('manage/edit', {
      GLOBAL : {
        id : req.session.userId,
        user : dataValues.account,
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

router.get('/:methodId',async (req,res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId: req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user
    const method_word = getFromNum(map,{
      detail: req.params.methodId
    })
    const { dimension, item, } = findParentByDetail(method_word)
    res.render('manage/edit',{
      GLOBAL: {
        id : req.session.userId,
        user : dataValues.account,
        year : res.locals.year,
        type : res.locals.type,
        campus : res.locals.campus,
        dimension : dimension,
        item : item,
        detail : method_word
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