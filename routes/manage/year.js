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
const {getYear, } = require('../../models/User/op')

router.get('/', async(req, res)=>{
  try{
    const user = await new Promise((resolve, reject)=>{
      User.findOne({
        id: req.session.userId,
      }, (err, user)=>{
        if(err)
          reject(err)
        if(user){
          resolve(user)
        }
      })
    })
    const files = await getYear({
      username : user.username,
    })
    //if years is undefined ,year.pug will render a empty files view
    if(files.length === 0)
      res.render('manage/year', {
        GLOBAL : {
          id :req.session.userId,
          user : user.username,
        },
      })
    else
      res.render('manage/year', {
        GLOBAL:{
          years : files,
          id: req.session.userId,
          user : user.username,
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