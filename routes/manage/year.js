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
const { map, } = require('../../data/operation/mapping')
const { findYearAll, } = require('../../models/mariadb/Year/op')

router.get('/', async(req, res)=>{
  try{
    const user = await User.findOne({
      where: {
        user_id:req.session.userId,
      },
    })

    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let {dataValues, } = user

    let files = await findYearAll(dataValues.user_id)
    // files will be transfered into the year value under years table
    files = files.map(val => val.year)
    //if years is undefined ,year.pug will render a empty files view
    res.render('manage/year', {
      GLOBAL:{
        years : files,
        id: req.session.userId,
        user : dataValues.user_name,
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