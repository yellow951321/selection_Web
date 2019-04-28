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
const { findCampusAll, } = require('../../models/operation/Data')

router.get('/', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })

    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user

    // let context = await findCampusByType(res.locals.year_id, res.locals.type_id)
    // context = context.map(val => [getFromNum(map, { campus: val.campus_name, type: res.locals.type_id, }), val.campus_id, ])
    let typeId = getFromWord(map, {type: res.locals.type, })
    let campusList = await findCampusAll(req.session.userId, res.locals.year, typeId)
    res.render('manage/campus', {
      GLOBAL : {
        campuses : campusList,
        id : req.session.userId,
        user : dataValues.account,
        year : res.locals.year,
        type : res.locals.type,
        map: map.campus,
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

module.exports = router