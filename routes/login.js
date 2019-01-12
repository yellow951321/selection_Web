const express =require('express');
const uid = require('uid-safe');
const fs = require('fs');

const router = express.Router();


var session = require('./session');
var User = require('./../models/user');
var sessionTable = require('./session');

router.get('/',(req,res)=>{
  res.render('login');
});

router.post('/check',(req,res)=>{
  var account = sessionTable.findBySId(req.body.sessionId);
  if(account){
    return res.status(200).send("OK");
  }else {
    return res.status(200).send("LOGIN");
  }
});


router.post('/in',(req,res)=>{
    /*User.findOne({
      username: req.body.username,
      password: req.body.password
    },(err,doc)=>{
      if(err){
        console.log(err);
        return res.status(400).send('Error occurs in login.js at 24');
      }
      if(doc){
        const sessionId = uid.sync(18);
        const SA = new SessionAccount('/',sessionId,doc.username,doc.password,0000000);
        sessionTable.push(SA);
        console.log(`${sessionTable} at login.js:30`);
        res.cookie('sessionId',sessionId);
        res.cookie('path',doc.username);
        res.status(200).send("OK");
      }else {
        res.status(400).send(`No matched account named ${req.body.username}`);
      }
    });*/
    res.status(200).send("OK");
});

router.post('/out',(req,res)=>{
  const sid = req.body.sessionId;
  const username  = req.body.username;
  sessionTable = sessionTable.filter((account)=>{
    return account.sessionId != sid && account.username != username;
  });
  res.status(200).send("Log out");
  console.log(`${req.body.username} log out`);
});


function SessionAccount(path,sessionId,username,password,expires){
  this.path = path || '/';
  this.sessionId = sessionId;
  this.password  = password;
  this.username = username;
  this.expires = expires;
}


module.exports = router;