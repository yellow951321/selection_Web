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
  console.log(req.body)
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
      req.session.userId = doc.id
      //console.log(req.session);
      res.status(200).send(doc.id)
    }else {
      console.log(doc)
      res.status(400).send(`No matched account named ${req.body.id}`)
    }
  })
})

router.post('/logout', (req, res)=>{
  delete req.session.userId
  res.status(200).send('Log out')
  //console.log(`${req.body.username} log out`)
})


router.get('/signup', (req, res)=>{
  res.render('signup')
})

router.post('/signup', (req, res)=>{
  var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi')
  if(!rMatch.test(req.body.id) && !rMatch.test(req.body.password)){
    console.log('enter')
    var id;
    User.countDocuments({},(err,num)=>{
      if(err) console.log(err);
        id = num +1;
        console.log(id);

        var user = new User({
          username: req.body.id,
          password: req.body.password,
          id: id
        })
        user.save().then((doc)=>{
          console.log(doc)
          res.status(200).send('OK')
          fs.mkdir('data/'+req.body.id, {recursive: true, }, (err)=>{
            if(err) console.log(err)
            else
              console.log('mkdir operation complete')
          })
        }, (e)=>{
          console.log(e)
          res.status(400).send(e)
        })
    });
  }
})

module.exports = router