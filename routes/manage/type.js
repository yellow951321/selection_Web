const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const User = require('../../models/schema/User')
const { map, getFromNum, getFromWord, } = require('../../data/operation/mapping')
// const { findCampusByType, } = require('../../models/mariadb/Campus/op')
const {findTypeAll, } = require('../../models/operation/Data')

router.get('/', async(req, res)=>{
  try{
    //get user information assign to user
    const user = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user

    let checkType = await findTypeAll(req.session.userId, res.locals.year)
    // translate the type number into word 0 for "大學" 1 for "技專院校"
    checkType = checkType.map(type => type == 0 ? '大學' : '技專院校')
    if(checkType.length !== 0)
      res.render('manage/type', {
        GLOBAL: {
          types : checkType,
          id : req.session.userId,
          user : dataValues.account,
          year : res.locals.year,
          map: map.campus,
        },
      })
  }
  catch (err) {
    res.status(403).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router
