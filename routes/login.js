const express =require('express')


const router = express.Router()

const User = require('./../models/user')



router.get('/', (req, res)=>{
  res.render('login')
})

router.post('/check', (req, res)=>{
  if(req.session.username && req.session.password){
    return res.status(200).send('OK')
  }else {
    return res.status(200).send('LOGIN')
  }
})


router.post('/in', (req, res)=>{
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

router.post('/out', (req, res)=>{
  delete req.session.username
  delete req.session.password
  res.status(200).send('Log out')
  //console.log(`${req.body.username} log out`)
})

module.exports = router