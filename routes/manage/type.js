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
const {getCampusType, } = require('../../models/mariadb/User/op')

router.get('/', async(req, res)=>{
  try{
    //get user information assign to user
    const user = await User.findOne({
        where:{
          user_id: req.session.userId
        }
      })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues} = user

    //get files under user/year folder
    const files = await getCampusType({
      username: dataValues.user_name,
      year : res.locals.year,
    })
    res.render('manage/type', {
      GLOBAL: {
        types : files,
        id : req.session.userId,
        user : dataValues.user_name,
        year : res.locals.year,
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
