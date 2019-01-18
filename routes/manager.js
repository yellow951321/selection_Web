const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const pug = require('pug')
const fs = require('fs')

const User = require('./../models/user')

function checkFileAsync(pathWithCampus,path){
  return new Promise((res,rej)=>{
    fs.stat(pathWithCampus,(err,state)=>{
      if(err){
        fs.mkdir(path,{recursive: true},(err)=>{
          if(err)
            rej(err)
          else
            res(true)
        })
      }
      else
        res(state)
    })
  })
}


router.post('/add', (req, res)=>{
  User.findOne({
    id : req.body.id
  },(err,doc)=>{
    return new Promise((res,rej)=>{
      if(err)
        rej(err)
      else{
        const pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
        const path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
        res(pathWithoutCampus,path)
      }
    })
  })
  .then((pathWithoutCampus,path)=>{
    return checkFileAsync(path,pathWithoutCampus)
  })
  .then(()=>{
    return new Promise((res,rej)=>{
      fs.copyFile('data/projectSchema',path,(err)=>{
        if(err)
          rej(err)
        else{
          res()
        }
      })
    })
  })
  .then(()=>{
    return new Promise((res,rej)=>{
     fs.readFile(path,(err,data)=>{
       if(err) rej(err)
       if(data){
         data = JSON.parse(data)
         data['年度'] = req.body.info.year
         res(data)
       }
     })
    })
  })
  .then((data)=>{
    return new Promise((res,rej)=>{
      fs.writeFile(path,JSON.stringify(data),(err)=>{
        if(err) rej(err)
        else{
          res.status(200).send('OK')
          console.log('Add project has been completed')
        }
      })
    })
  })
  .catch((err)=>{
    console.log(err)
  })
  //res.render('manage/_render_manage',{info:[req.body.info]});
})


router.post('/content/save', (req, res)=>{
  // console.log(req.body);
  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) res.status(400)
      if(doc){
        const year = req.body.info.year
        const type = req.body.info.type
        const campus = req.body.info.campus
        const data = req.body.data
        const dimension = req.body.info.dimension
        const item = req.body.info.item
        const detail = req.body.info.detail
        const pathWithCampus = PathGen(username,year,type,campus)
        const path = pathGenWithoutCampus(username,year,type)

        checkFileAsync(pathWithCampus,path)
        .then((state)=>{
          if(state)
            return new Promise((res,rej)=>{
              nodeToObj(pathWithCampus,
                {dimension: dimension,
                  item : item,
                  detail: detail
                },data,(modData)=>{
                if(modData)
                  res(modData)
                else
                  rej(new Error('the nodeToObj function make mistake'))
              })
            })
        })
        .then((modData)=>{
          return new Promise((res,rej)=>{
            fs.writeFile(pathWithCampus,JSON.stringify(modData),(err)=>{
              if(err)
                rej(err)
              else
                res()
            })
          })
        })
        .then(()=>{
          console.log(`Save ${pathWithCampus} is completed`)
          res.status(200).send('OK')
        })
        .catch((err)=>{
          if(err)
            console.log(err)
        })
      }
    })

  }else{
    res.status(400).send('No sessionId')
  }
})

router.post('/content/add', (req, res)=>{
  res.render('manage/newEdit')
})

router.post('/content/filter',(req,res)=>{
  if(req.session.id){
    User.findOne({
      id: req.session.id
    },(err,doc)=>{
      return new Promise((res,rej)=>{
        if(err)
          rej(err)
        else{
          const pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
          const path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
          res(pathWithoutCampus,path)
        }
      })
    })
    .then((pathWithoutCampus,path)=>{
      return checkFileAsync(path,pathWithoutCampus)
    })
    .then(()=>{
      return new Promise((res,rej)=>{
        fs.readFile(path,(err,data)=>{
          if(err) rej(err)
          else
            res(JSON.parse(data))
        })
      })
    })
    .then((data)=>{
      objToNode({
        dimension : req.body.info.dimension,
        item : req.body.info.item,
        detail : req.body.info.detail
      },data,(context)=>{
        res.render(context);
      })
    })
    .catch((err)=>{
      if(err)
        console.log(err)
    })
  }
})

router.post('/content/delete',(req,res)=>{
  if(req.sesssion.id){
    User.findOne({
      id: req.session.id
    },(err,doc)=>{
      return new Promise((res,rej)=>{
        if(err) rej(err)
        if(doc){
          const pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
          const path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
          res(pathWithoutCampus,path)
        }
      })
    })
    .then((pathWithoutCampus,path)=>{
        return checkFileAsync(path,pathWithoutCampus)
    })
    .then(()=>{
      return new Promise((res,rej)=>{
        fs.readFile(path,(err,data)=>{
          if(err) rej(err)
          if(data){
            res(JSON.parse(data))
          }
        })
      })
    })
    .then((data)=>{
      return new Prommise((res,rej)=>{
        let deleteObj = data[req.body.info.dimension][req.body.info.item][req.body.info.detail]
        if(deleteObj instanceof Array){
          deleteObj = deleteObj.filter((element)=>{
            return  element.title != req.body.data.title && element.paragraph != req.body.data.content
          })
          res(data)
        }
      })
    })
    .then((modData)=>{
      return new Promise((res,rej)=>{
        fs.writeFile(path,JSON.stringify(modData),(err)=>{
          if(err)
            rej(err)
          else
            res()
        })
      })
    })
    .then(()=>{
      res.status(200).send('OK')
      console.log('Deletetion operation has been finished')
    })
    .catch((err)=>{
      if(err)
        console.log(err)
    })
  }
})
router.post('/schema', (req, res)=>{
  fs.readFile('data/projectSchema.json', (err, data)=>{
    if(err) return console.log(err)
    if(data){
      res.status(200).send(data)
    }
  })
})

router.get('/:userId', (req, res)=>{
  //sessionId
  console.log(req.session.id)
  //session cookie
  console.log(req.session)

  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) console.log(err)
      if(doc){
        console.log(doc)
        fetch({
          username: doc.username,
        }, (files)=>{
          if(files instanceof Array){
            res.render('manage/select', {contents: files, })
          }
        })
      }
    })
  }else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:3000/auth/login">Click Here</a>')
    res.send()
  }
})

router.get('/:userId/:year', (req, res)=>{
  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) console.log(err)
      if(doc){
        console.log(doc)
        fetch({
          username: doc.username,
          year: req.params.year
        }, (files)=>{
          if(files instanceof Array){
            res.render('manage/select', {contents: files, })
          }
        })
      }
    })
  }else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:3000/auth/login">Click Here</a>')
    res.send()
  }
})

router.get('/:userId/:year/:type', (req, res)=>{
  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) console.log(err)
      if(doc){
        console.log(doc)
        fetch({
          username: doc.username,
          year: req.params.year,
          type : req.params.type
        }, (files)=>{
          if(files instanceof Array){
            splitArrayIntoContext(files,(context)=>{
              console.log(context);
              res.render('manage/manage',{info:context})
            })
          }
        })
      }
    })
  }else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:3000/auth/login">Click Here</a>')
    res.send()
  }
})

router.get('/:userId/:year/:type/:campus', (req, res)=>{
  console.log(req.session.userId);
  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) {
        console.log(err)
        res.status(400).send('Error occured')
      }
      if(doc)
        res.render('manage/edit')
    })
  }else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:3000/auth/login">Click Here</a>')
    res.send()
  }
})



router.post('/delete', (req, res)=>{
  if(req.session.id){
    User.findOne({
      id: req.session.id
    },(err,doc)=>{
      return new Promise((res,rej)=>{
        if(err) rej(err)
        if(doc){
          const oldPath = pathGen(doc.username, req.body.info.year, req.body.info.type, req.body.info.campus)
          const newPath = pathGenDeleteName(doc.username, req.body.info.year, req.body.info.type, req.body.info.campus)
          res(oldPath,newPath)
        }
      })
    })
    .then((oldPath,newPath)=>{
      return new Promise((res,rej)=>{
        fs.rename(oldPath,newPath,(err)=>{
          if(err)
            rej(err)
          else
            res()
        })
      })
    })
    .then(()=>{
      res.status(200).send('OK')
    })
    .catch((err)=>{
      if(err)
        console.log(err)
    })
  }
})

function pathGen(username, year, type, campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+year+'_'+type+'_'+campus+'.json'
}
function pathGenWithoutCampus(username, year, type){
  return 'data/'+username+'/'+year+'/'+type
}

function pathGenDeleteName(username, year, type, campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+year+'_'+type+'_'+campus+'_'+'d'+'.json'
}
function fetch(info, cb){
  const username = info.username ? `/${info.username}`: ''
  const year = info.year ? `/${info.year}` : ''
  const type = info.type ? `/${info.type}` : ''
  const campus = info.campus ? `/${info.year +'_'+info.type+'_'+info.campus+'.json'}` : ''
  const path = 'data'+username+year+type+campus
  const dimension = info.dimension
  const item = info.item
  const detail = info.detail
  // console.log(path);
  if(campus != ''){
    fs.readFile(path, 'utf-8', (err, data)=>{
      if(err) return console.log(err)
      if(data){
        cb({dimension: dimension,item: item, detail: detail},JSON.parse(data))
      }
    })
  }else{
    fs.readdir(path, (err, files)=>{
      if(err) return console.log(err)
      if(files){
        console.log('read complete')
        //console.log(files);
        cb(files)
      }
    })
  }
}

function splitArrayIntoContext(arr, cb){
  var temp = []
  for(name of arr){
    let t;
    var content = name.split('_')
    if(content.length <= 3){
      t = content[2].match(/[^.]+/)[0]
      temp.push(t)
    }
  }
  cb(temp)
}


function objToNode(range,project,cb){
  // console.log(project);
  var context = []
  if(project[range.dimension][range.item][range.detail] instanceof Array && project[range.dimension][range.item][range.detail].length > 0){
    for(content of project[range.dimension][range.item][range.detail]){
      let t = {};
      t.dimension = dimension
      t.item = item
      t.detail = detail
      t.context = content.paragraph
      t.page = {}
      t.page.start = content.page[0]
      t.page.end = content.page[1]

      context.push(t)
    }
  }
  cb(context)
}

function nodeToObj(path,info,body,cb){
  fs.readFile(path, 'utf-8', (err, data)=>{
    if(err) return console.log(err)
    if(data){
      data = JSON.parse(data)
      // console.log(body);
      if(body instanceof Object){
        let t = new ContentSchema(body.page,body.content,body.title);
        data[info.dimension][info.item][info.detail].push(t)
      }
      cb(data)
    }
  })
}




function ContentSchema(page, paragraph,title){
  if(page.start && page.end){
    this.page = []
    this.page[0] = page.start
    this.page[1] = page.end
  }
  this.paragraph = paragraph ? paragraph : ''
  this.title = title ? title : ''
}
module.exports= router