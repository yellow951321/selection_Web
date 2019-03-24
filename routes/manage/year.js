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
const { map, } = require('../../data/operation/mapping')
const { findYearAll, } = require('../../models/newModel/operation/Data')

router.get('/', async(req, res)=>{
  try{
    const user = await User.findOne({
      where: {
        userId : req.session.userId,
      },
    })

    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let {dataValues, } = user

    let files = await findYearAll(dataValues.userId)
    // files will be transfered into the year value under years table
    res.render('manage/year', {
      GLOBAL:{
        years : files,
        id: req.session.userId,
        user : dataValues.account,
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