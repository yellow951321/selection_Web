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
const {getYear} = require('./../../models/User/op')

router.get('/',async (req,res)=>{
  try{
    const doc = await new Promise((resolve,reject)=>{
      User.findOne({
        id: req.session.userId
      },(err,doc)=>{
        if(err)
          reject(err)
        if(doc){
          resolve(doc)
        }
      })
    })
    const files = await getYear({
      username : doc.username
    })
    res.render('manage/select',{contents: files})
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