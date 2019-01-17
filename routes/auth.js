const fs = require('fs')
const express = require('express')

const User = require('./../models/user')

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
  User.findOne({
    username: req.body.username,
    password: req.body.password,
  }, (err, doc)=>{
    if(err){
      console.log(err)
      return res.status(400).send('Error occurs in login.js at 24')
    }
    if(doc){
      //res.cookie('sessionId', sessionId)
      req.session.username = doc.username
      req.session.password = doc.password
      //console.log(req.session);
      res.status(200).send('OK')
    }else {
      res.status(400).send(`No matched account named ${req.body.username}`)
    }
  })
})

router.post('/logout', (req, res)=>{
  delete req.session.username
  delete req.session.password
  res.status(200).send('Log out')
  //console.log(`${req.body.username} log out`)
})


router.get('/signup', (req, res)=>{
  res.render('signup')
})

router.post('/signup', (req, res)=>{
  var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi')
  if(!rMatch.test(req.body.username) && !rMatch.test(req.body.password)){
    console.log('enter')
    var user = new User({
      username: req.body.username,
      password: req.body.password,
    })
    console.log('Eeeee')
    user.save().then((doc)=>{
      console.log(doc)
      res.status(200).send('OK')
      fs.mkdir('data/'+req.body.username, {recursive: true, }, (err)=>{
        if(err) console.log(err)
        else
          console.log('mkdir operation complete')
      })
    }, (e)=>{
      console.log(e)
      res.status(400).send(e)
    })
  }
})

module.exports = router