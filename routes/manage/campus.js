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
const {getCampus} = require('../../models/User/op')

function splitArrayIntoContext(arr){
  let temp = []
  for(let name of arr){
    let t;
    let content = name.split('_')
    if(content.length <= 3){
      t = content[2].match(/[^.]+/)[0]
      temp.push(t)
    }
  }
  return temp
}

router.get('/',async (req,res)=>{
  try{
    if(!req.session.userId)
      throw new Error('unauthorized request')

    const user = await new Promise((resolve,reject)=>{
      User.findOne({
        id: req.session.userId
      },(err,user)=>{
        if(err) reject(err)
        if(user){
          resolve(user)
        }
      })
    })
    const files = await getCampus({
      username: user.username,
      year : res.locals.year,
      type : res.locals.type
    })

    // @todo remove dependency
    const context = splitArrayIntoContext(files)

    res.render('manage/campus',{
      GLOBAL : {
        campuses : context,
        id : req.session.userId,
        user : user.username,
        year : res.locals.year,
        type : res.locals.type
      }
    })
  }
  catch (err){
    res.status(403).render('error',{
      message : err,
      error: {
        status: err.status
      }
    })
  }
})

module.exports = router