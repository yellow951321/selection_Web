const express = require('express');
const router = express.Router();
const fs = require('fs');

var sessionTable = require('/session');

router.post('/fetch',(req,res)=>{
  const username = req.body.username;
  const sessionId = req.body.sessionId;

  var account = sessionTable.filter((account)=>{
    return account.username == username && account.sessionId == sessionId;
  });
  if(account.length == 1){
    
  }else{
    return res.status(400).send();
  }

});

router.post('/save',(req,res)=>{
  
});