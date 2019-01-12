const express = require('express');
const router = express.Router();
const fs = require('fs');

var sessionTable = require('./session');

router.post('/add',(req,res)=>{
  //const username = sessionTable.findBySId(req.body.sessionId);
  res.render('/////',req.body.info);
});

router.post('/save',(req,res)=>{
  const account = sessionTable.findBySId(req.body.sessionId);
  if(account){
    const username = account.username;
    const year = req.info.year;
    const type = req.info.type;
    const campus = req.info.campus;
    const name = req.info.name;
    const data = req.data;
    const pathWithName = pathGen(username,year,campus,name);
    const path = pathGenWithoutName(username,year,campus);
    fs.stat(pathWithName,(err,state)=>{
      if(err){
        fs.mkdir(path,{recursive: true},(err)=>{
          if(err) return console.log(err);
          console.log(`make dir and files in ${path}`);
          fs.writeFile(pathWithName,data,(err)=>{
            if(err) return console.log(err);
            console.log(`Save ${pathWithName} is completed`);
            return res.status(200).send("OK");
          });
        });
      }else if(state){
        fs.writeFile(pathWithName,data,(err)=>{
          if(err) return console.log(err);
          console.log(`Save ${pathWithName} is completed`);
          return res.status(200).send("OK");
        });
      }
    });
  }
});


router.post('/fetch',(req,res)=>{
  var account = sessionTable.findBySId(req.body.sessionId);
  if(account){
    var files = fetch(req.body.info);
    if(files instanceof Array){
      //render the problem.
    }else{
      //render the editNode.
    }
  }
});

function pathGen(username,year,type,campus,name){
  return '../data/'+username+'/'+year+'/'+type+'/'+campus+'/'+name+'.json';
}
function pathGenWithoutName(username,year,type,campus){
  return '../data/'+username+'/'+year+'/'+type+'/'+campus;
}

function fetch(info){
  const username = info.username ? `/${info.username}/`: '';
  const year = info.year ? `/${info.year}/` : '';
  const type = info.type ? `/${info.type}/` : '';
  const campus = info.campus ? `/${info.campus}/` : '';
  const proName = info.proName ? `/${info.proName}/` : '';
  const path = pathGen(username,year,type,campus,proName);
  if(proName != ""){
    fs.readFile(path,"utf-8",(err,data)=>{
      if(err) return console.log(err);
      if(data){
        return JSON.parse(data);
      }
    });
  }else{
    fs.readdir(path,(err,files)=>{
      if(err) return console.log(err);
      if(files){
        return files;
      }
    });
  }
}


module.exports= router;