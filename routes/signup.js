const express = require('express');
const fs = require('fs');
const User = require('./../models/user');

const router = express.Router();

router.get('/',(req,res)=>{
  res.render('signup');
});

router.post('/',(req,res)=>{
  var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>','gi');
  if(!rMatch.test(req.body.username) && !rMatch.test(req.body.password)){
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });

    user.save().then((doc)=>{
      console.log(doc);
      res.status(200).send("OK");
      fs.mkdir('/../data/'+req.body.username,{recursive: true});
    },(e)=>{
      console.log(e);
      res.status(400).send(e);
    });
  }
});

module.exports = router;