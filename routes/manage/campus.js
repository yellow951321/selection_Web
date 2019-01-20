const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const User = require('./../../models/User/user')
const {getCampus} = require('./../../models/User/op')

function splitArrayIntoContext(arr){
  var temp = []
  for(name of arr){
    let t;
    var content = name.split('_')
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

    const doc = await new Promise((resolve,reject)=>{
      User.findOne({
        id: req.session.userId
      },(err,doc)=>{
        if(err) reject(err)
        if(doc){
          resolve(doc)
        }
      })
    })
    const files = await getCampus({
      username: doc.username,
      year : req.session.year,
      type : req.session.type
    })

    // @todo remove dependency
    const context = splitArrayIntoContext(files)

    res.render('manage/manage',{info:context})
  }
  catch (err){
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
  }
})

module.exports = router