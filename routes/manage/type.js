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
const { map, getFromNum, getFromWord, } = require('../../data/operation/mapping')
const { findCampusByType, } = require('../../models/mariadb/Campus/op')

router.get('/', async(req, res)=>{
  try{
    //get user information assign to user
    const user = await User.findOne({
      where:{
        user_id: req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user

    let files = []
    // check if there's 普通大學 in the database
    let checkType = await findCampusByType(res.locals.year_id, '0')
    if(checkType.length !== 0)
      files.push(getFromNum(map, {type: '0', }))

    // check if there's 技職學校 in the database
    checkType = await findCampusByType(res.locals.year_id, '1')
    if(checkType.length !== 0)
      files.push(getFromNum(map, {type: '1', }))
    res.render('manage/type', {
      GLOBAL: {
        types : files,
        id : req.session.userId,
        user : dataValues.user_name,
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
