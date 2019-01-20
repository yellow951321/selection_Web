const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const User = require('../../models/User/schema')
const {getCampusType} = require('../../models/User/op')

router.get('/',async (req,res)=>{
  try{
    //get user information assign to user
    const user = await new Promise((resolve,reject)=>{
      User.findOne({
        id : req.session.userId
      },(err,user)=>{
        if(err) reject(err)
        if(user){
          resolve(user)
        }
      })
    })
    //get files under user/year folder
    const files = await getCampusType({
      username: user.username,
      year : res.locals.year
    })
    res.render('manage/type',{
      GLOBAL: {
        types : files,
        id : req.session.userId,
        user : user.username,
        year : res.locals.year
      }
    })
  }
  catch (err) {
    res.status(403).render('error',{
      message : err,
      error: {
        status: err.status
      }
    })
  }
})

module.exports = router
