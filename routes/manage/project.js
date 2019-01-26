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

module.exports = router