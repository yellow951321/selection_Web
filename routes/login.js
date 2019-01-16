const express =require('express')
const uid = require('uid-safe')

const router = express.Router()

const User = require('./../models/user')
const sessionTable = require('./session')

function SessionAccount(path, sessionId, username, password, expires){
    this.path = path || '/'
    this.sessionId = sessionId
    this.password = password
    this.username = username
    this.expires = expires
}

router.get('/', (req, res)=>{
  res.render('login')
})

router.post('/check', (req, res)=>{
  var account = sessionTable.findBySId(req.body.sessionId)
  if(account){
    return res.status(200).send('OK')
  }else {
    return res.status(200).send('LOGIN')
  }
})


router.post('/in', (req, res)=>{
  User.findOne({
    username: req.body.username,
    password: req.body.password
  }, (err, doc)=>{
    if(err){
      console.log(err)
      return res.status(400).send('Error occurs in login.js at 24')
    }
    if(doc){
      const sessionId = uid.sync(18)
      const SA = new SessionAccount('/', sessionId, doc.username, doc.password, 0000000)
      sessionTable.push(SA)
      console.log(sessionTable+'at login.js:39')
      res.cookie('sessionId', sessionId)
      res.status(200).send('OK')
    }else {
      res.status(400).send(`No matched account named ${req.body.username}`)
    }
  })
})

router.post('/out', (req, res)=>{
  const sid = req.body.sessionId
  //const username  = req.body.username;
  sessionTable = sessionTable.filter((account)=>{
    return account.sessionId != sid
  })
  res.cookie('sessionId', '')
  res.cookie('path', '')
  res.status(200).send('Log out')
  console.log(`${req.body.username} log out`)
})

module.exports = router