const fs = require('fs')
const express = require('express')

const User = require('../models/User/schema')

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/login', (req, res)=>{
  res.render('login')
})

router.post('/login', (req, res)=>{
  console.log(req.body)
  new Promise((resolve, reject) => {
    User.findOne({
      username: req.body.username,
      password: req.body.password,
    }, (err, doc)=>{
      if(err){
        reject(new Error(`Database error: ${err}`))
      }
      if(doc){
        resolve(doc)
      }else {
        reject(new Error(`帳號或密碼錯誤`))
      }
    })
  })
    .then((doc)=>{
      req.session.userId = doc.id
      res.redirect(`/man/${doc.id}`)
    })
    .catch(err=>{
      return res.status(400).render('login', {error:err.message})
    })
})

router.get('/logout', (req, res)=>{
  req.session = null
  res.status(200).redirect('/auth/login')
})

router.get('/signup', (req, res)=>{
  res.render('signup')
})

router.post('/signup', (req, res)=>{
  var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi')
  if(!rMatch.test(req.body.username) && !rMatch.test(req.body.password)){
    new Promise((resolve, reject)=>{
      User.countDocuments({}, (err, num)=>{
        if(err) reject(err)
        else{
          resolve(num+1)
        }
      })
    })
      .then((id)=>{
        var user = new User({
          username: req.body.username,
          password: req.body.password,
          id: id,
        })
        return user.save()
      })
      .then(()=>{
        res.status(200).send('OK')
        fs.mkdir('data/'+req.body.username, {recursive: true, }, (err)=>{
          if(err) throw err
          console.log('mkdir operation complete')
        })
      })
      .catch((err)=>{
        res.status(400).send(err)
      })
  }
})

module.exports = router