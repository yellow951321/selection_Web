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
  const pathWithoutName = pathGenWithoutName(username,req.body.info.year,req.body.info.type,req.body.info.campus);
  const path = pathGen(username,req.body.info.year,req.body.info.type,req.body.info.campus,req.body.info.name);
  fs.stat(path,(err,state)=>{
    if(err){
      console.log(err);
      fs.mkdir(pathWithoutName,{recursive:true},(err)=>{
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
    const year = req.body.info.year;
    const type = req.body.info.type;
    const campus = req.body.info.campus;
    const name = req.body.info.name;
    const data = req.body.data;
    const pathWithName = pathGen(username,year,type,campus,name);
    const path = pathGenWithoutName(username,year,type,campus);
    fs.stat(pathWithName,(err,state)=>{
      if(err){
        fs.mkdir(path,{recursive: true},(err)=>{
          if(err) return console.log(err);
          console.log(`make dir and files in ${path}`);
          nodeToObj(pathWithName,data,(modData)=>{
            fs.writeFile(pathWithName,modData,(err)=>{
              if(err) return console.log(err);
              console.log(`Save ${pathWithName} is completed`);
              return res.status(200).send("OK");
            });
          });
        });
      }else if(state){
        nodeToObj(pathWithName,data,(modData)=>{
          fs.writeFile(pathWithName,modData,(err)=>{
            if(err) return console.log(err);
            console.log(`Save ${pathWithName} is completed`);
            return res.status(200).send("OK");
          });
        });
      }
    });
  }
});

router.post('/schema',(req,res)=>{
  fs.readFile('data/projectSchema.json',(err,data)=>{
    if(err) return console.log(err);
    if(data){
      res.status(200).send(data);
    }
  });
});

router.post('/fetch',(req,res)=>{
  var account = sessionTable.findBySId(req.body.sessionId);
  console.log(req.body);
  const info = {
    username : 'nober',
    year : req.body.year,
    type : req.body.type,
    campus : req.body.campus,
    proName : req.body.name
  }
  console.log(info);
  if(account == undefined){
    fetch(info,(files)=>{
        if(files instanceof Array && !req.body.campus ){
          console.log(files);
          res.render('manage/_render_select_button',{contents: files});
        }else if(files instanceof Array && req.body.campus){
          console.log(files);
          splitArrayIntoContext(files,(context)=>{
            console.log(context);
            res.render('manage/_render_manage',{info:context});
          });
        }else if(files instanceof Object ){
          objToNode(files,(context)=>{
            res.render('manage/_edit',{info:context});
          });
        }
    });
  }

});

router.post('/edit',(req,res)=>{
  var account = sessionTable.findBySId(req.body.sessionId);
  const info = {
    username : 'nober',
    year : req.body.year,
    type : req.body.type,
    campus : req.body.campus,
    proName : req.body.name
  }
  console.log(info);
  fetch(info,(files)=>{
    //console.log(files);
    if(files instanceof Object){
      objToNode(files,(context)=>{
        console.log(context);
        res.render('manage/_edit',{info:context});
      });
    }
  });
});




function pathGen(username,year,type,campus,name){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus+'/'+year+'_'+type+'_'+campus+'_'+name+'.json';
}
function pathGenWithoutName(username,year,type,campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus;
}

function fetch(info,cb){
  const username = info.username ? `/${info.username}`: '';
  const year = info.year ? `/${info.year}` : '';
  const type = info.type ? `/${info.type}` : '';
  const campus = info.campus ? `/${info.campus}` : '';
  const proName = info.proName ? `/${info.year +'_'+info.type+'_'+info.campus+'_'+info.proName+'.json'}` : '';
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
        //console.log(files);
        cb(files);
      }
    });
  }
}

function splitArrayIntoContext(arr,cb){
  var temp = [];
  for(name of arr){
    let t = {};
    var content = name.split("_");
    t.year = content[0];
    t.type = content[1];
    t.campus = content[2];
    t.name = content[3].match(/[^.]+/)[0];
    temp.push(t);
    
  }
  cb(temp);
}


function objToNode(project,cb){
  console.log(project);
  var context = [];
  for(dimension in project)
    for(item in dimension)
      for(detail in item){
        if(detail instanceof Array && detail.length > 0){
          for(content of detail){
            let t = {};
              t.dimension = dimension;
              t.item = item;
              t.detail = detail;
              t.content = content.paragraph;
              t.page.start = content.page[0];
              t.page.end = content.page[1];
              console.log("Adding");
              context.push(t);
          }
        }
      }

  cb(context);
}

function nodeToObj(path,body,cb){
  fs.readFile(path,"utf-8",(err,data)=>{
    if(err) return console.log(err);
    if(data){
      data = JSON.parse(data);
      if(body instanceof Array){
        for(con in body){
          var item = new ContentSchema(con.page,con.content);
          data[con.dimension][con.item][con.detail].push(item);
        }
      }
      cb(data);
    }
  });
}




function ContentSchema(page,paragraph){
  if(page.start && page.end){
    this.page = [];
    this.page[0] = page.start;
    this.page[1] = page.end;
  }
  this.paragraph = paragraph ? paragraph : "";
  this.title = "";
}
module.exports= router;