const express = require('express');
const router = express.Router();
const pug = require('pug');
const fs = require('fs');

var sessionTable = require('./session');

router.get('/',(req,res)=>{
  res.render('index',{title:'express'});
});

router.post('/add',(req,res)=>{
  //const username = sessionTable.findBySId(req.body.sessionId);
  const username = "nober";
  const path = pathGen(username,req.body.info.year,req.body.info.type,req.body.info.campus,req.body.info.name);
  fs.stat(path,(err,state)=>{
    if(err){
      console.log(err);
      fs.mkdir(path,{recursive:true},(err)=>{
        if(err) console.log(err);
        console.log('mkdir operation complete');
      });
    }
    console.log(state);
    
  });
  fs.copyFile('data/projectSchema.json',path,(err)=>{
    if(err) console.log(err);
    else  
      console.log("Mdir operation is completed");
  });
  res.render('manage/_render_manage',{info:[req.body.info]});
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
  console.log(req.body);
  const info = {
    username : 'nober',
    year : req.body.year,
    type : req.body.type,
    campus : req.body.campus
  }
  console.log(info);
  if(account == undefined){
    fetch(info,(files)=>{
        if(files instanceof Array){
          console.log(files);
          res.render('manage/_render_select_button',{contents: files});
        }else{
        }
    });
  }

});

router.post('/edit',(req,res)=>{
  //edit when press edition btn
});




function pathGen(username,year,type,campus,name){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus+'/'+name+'.json';
}
function pathGenWithoutName(username,year,type,campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus;
}

function fetch(info,cb){
  const username = info.username ? `/${info.username}`: '';
  const year = info.year ? `/${info.year}` : '';
  const type = info.type ? `/${info.type}` : '';
  const campus = info.campus ? `/${info.campus}` : '';
  const proName = info.proName ? `/${info.proName}` : '';
  const path = 'data'+username+year+type+campus+proName;
  console.log(path);
  if(proName != ""){
    fs.readFile(path,"utf-8",(err,data)=>{
      if(err) return console.log(err);
      if(data){
         cb(JSON.parse(data));
      }
    });
  }else{
    fs.readdir(path,(err,files)=>{
      if(err) return console.log(err);
      if(files){
        console.log('read complete');
        console.log(files);
        cb(files);
      }
    });
  }
}


module.exports= router;