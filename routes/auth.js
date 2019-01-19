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
  new Promise((resolve, reject) => {
    User.findOne({
      username: req.body.username,
      password: req.body.password,
    }, (err, doc)=>{
      if(err){
        reject(new Error('Error occurs in login.js at 24'))
      }
      if(doc){
        resolve(doc)
      }else {
        reject(new Error(`No matched account named ${req.body.id}`))
      }
    })
  })
  .then((doc)=>{
    req.session.userId = doc.id
    res.status(200).send(doc.id)
  })
  .catch(err=>{
    return res.status(400).send(err.message)
  })
})

router.post('/logout', (req, res)=>{
  req.session = null
  res.status(200).send('Log out')
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
          username: req.body.username,
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