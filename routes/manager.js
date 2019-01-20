const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const fs = require('fs')

const User = require('../models/User/user')
const UserOp = require('../models/User/op')
function checkFileAsync(pathWithCampus,path){
  console.log(path)
  console.log(pathWithCampus)
  return new Promise((res,rej)=>{
    fs.stat(pathWithCampus,(err,state)=>{
      if(err){
        fs.mkdir(path,{recursive: true},(err)=>{
          if(err){
            console.log('No file making file')
            rej(err)
          }
          else{
            console.log('No file making file !!')
            res(true)
          }
        })
      }
      else{
        console.log('Having file resolve file')
        res(state)
      }
    })
  })
}

function findUsernameAsync(col,id){
  return new Promise((res,rej)=>{
    col.findOne({
      id: id
    },(err,doc)=>{
      if(err) rej(err)
      if(doc){
        res(doc)
      }
    })
  })
}

function pathGen(username, year, type, campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+year+'_'+type+'_'+campus+'.json'
}
function pathGenWithoutCampus(username, year, type){
  return 'data/'+username+'/'+year+'/'+type
}

function pathGenDeleteName(username, year, type, campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+year+'_'+type+'_'+campus+'_'+'d'+'.json'
}

function splitArrayIntoContext(arr){
  var temp = []
  for(name of arr){
    let t;
    var content = name.split('_')
    if(content.length <= 3){
      t = content[2].match(/[^.]+/)[0]
      temp.push(t)
    }
  }
  return temp
}


function objToNode(range,project,cb){
  // console.log(project);
  var context = []
  if(project[range.dimension][range.item][range.detail] instanceof Array && project[range.dimension][range.item][range.detail].length > 0){
    for(const [index,content] of project[range.dimension][range.item][range.detail].entries()){
      let t = {};
      t.content = content.paragraph
      t.title = content.title
      t.page = {}
      t.page.start = content.page[0]
      t.page.end = content.page[1]
      t.index = index

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
        let t = new ContentSchema(body.page,body.data,body.title);
        var arr = data[info.dimension][info.item][info.detail]
        if(arr instanceof Array && arr.length != info.index){
          arr[info.index] = t
        }
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


router.post('/name',(req,res)=>{
  if(req.session.userId){
    User.findOne({
      id: req.session.userId
    },(err,doc)=>{
      if(err) {
        console.log(err)
        res.status(400).send()
      }
      if(doc){
        console.log(doc.username)
        res.status(200).send(doc.username)
      }
    })
  }
})


router.get('/:userId', async (req, res)=>{
  try {
    if(!req.session.userId)
      throw new Error('unauthorized request');
    const doc = await new Promise((resolve,reject)=>{
      User.findOne({
        id: req.session.userId
      },(err,doc)=>{
        if(err)
          reject(err)
        if(doc){
          resolve(doc)
        }
      })
    });
    const files = await UserOp.getYear({
      username : doc.username
    })

    // @todo add empty files view
    res.render('manage/select',{contents: files})
  }
  catch (err) {
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
  }
})

router.get('/:userId/:year',async (req, res)=>{
  try{
    if(!req.session.userId) //Check session
      throw new Error('unauthorized request')
    //get user information assign to doc
    const doc = await new Promise((resolve,reject)=>{
      User.findOne({
        id : req.session.userId
      },(err,doc)=>{
        if(err) reject(err)
        if(doc){
          resolve(doc)
        }
      })
    })
    //get files under user/year folder
    const files = await UserOp.getCampusType({
      username: doc.username,
      year : req.params.year
    })
    res.render('manage/select',{contents: files})
  }
  catch (err) {
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
  }
})

router.get('/:userId/:year/:type', async (req, res)=>{
  try{
    if(!req.session.userId)
      throw new Error('unauthorized request')

    const doc = await new Promise((resolve,reject)=>{
      User.findOne({
        id: req.session.userId
      },(err,doc)=>{
        if(err) reject(err)
        if(doc){
          resolve(doc)
        }
      })
    })
    const files = await UserOp.getCampus({
      username: doc.username,
      year : req.params.year,
      type : req.params.type
    })

    // @todo remove dependency
    const context = splitArrayIntoContext(files)

    res.render('manage/manage',{info:context})
  }
  catch (err){
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
  }
})

router.get('/:userId/:year/:type/:campus', async (req, res)=>{
  try{
    if(!req.session.userId) //Check session
      throw new Error('unauthorized request')
    res.render('manage/edit')
  }
  catch (err) {
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
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

router.post('/add', (req, res)=>{
  let pathWithoutCampus,path
  console.log(req.body)
  if(req.session.userId){
    findUsernameAsync(User,req.session.userId)
    .then((doc)=>{
      pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
      path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
    })
    .then(()=>{
      return checkFileAsync(path,pathWithoutCampus)
    })
    .then(()=>{
      fs.copyFile('data/projectSchema.json',path,(err)=>{
        if(err) throw err
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
    .then((modData)=>{
      console.log(modData + 'in here')
      fs.writeFile(path,JSON.stringify(modData),(err)=>{
        if(err) throw err
        else{
          //res.render('')
          res.send('OK')
          console.log('Add operation is finished')
        }
      })
    })
    .catch((err)=>{
      if(err)
        console.log(err)
    })
  }
  //res.render('manage/_render_manage',{info:[req.body.info]});
})



router.post('/delete', (req, res)=>{
  if(req.session.userId){
    findUsernameAsync(User,req.session.userId)
    .then((doc)=>{
      if(doc){
        const oldPath = pathGen(doc.username, req.body.info.year, req.body.info.type, req.body.info.campus)
        const newPath = pathGenDeleteName(doc.username, req.body.info.year, req.body.info.type, req.body.info.campus)
        return {oldPath: oldPath,newPath: newPath}
      }
    })
    .then((obj)=>{
      fs.rename(obj.oldPath,obj.newPath,(err)=>{
        if(err) throw err
        else {
          res.status(200).send('OK')
        }
      })
    }).catch((err)=>{
      if(err)
        console.log(err)
    })
  }
})

router.post('/content/filter',(req,res)=>{
  var pathWithoutCampus,path
  console.log(req.body)
  if(req.session.userId){
    findUsernameAsync(User,req.session.userId)
    .then((doc)=>{
      pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
      path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
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
        res.render('manage/filter',{contents: context});
      })
    })
    .catch((err)=>{
      if(err)
        console.log(err)
    })
  }
})


router.post('/content/add', (req, res)=>{
  var path,pathWithoutCampus
  if(req.session.userId){
    findUsernameAsync(User,req.session.userId)
    .then((doc)=>{
      pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
      path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
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
      let t = new ContentSchema({start:1,end:1},'','')
      data[req.body.info.dimension][req.body.info.item][req.body.info.detail].push(t)
      let length =  data[req.body.info.dimension][req.body.info.item][req.body.info.detail].length - 1
      res.render('manage/newEdit',{index:length})
      fs.writeFile(path,JSON.stringify(data),(err)=>{
        if(err) console.log(err)
      })
    })
  }
})
router.post('/content/save', (req, res)=>{
  console.log(req.body);
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
        const pathWithCampus = pathGen(doc.username,year,type,campus)
        const path = pathGenWithoutCampus(doc.username,year,type)
        checkFileAsync(pathWithCampus,path)
        .then((state)=>{
          if(state)
            return new Promise((res,rej)=>{
              nodeToObj(pathWithCampus,
                {dimension: dimension,
                  item : item,
                  detail: detail,
                  index: req.body.index
                },{
                  page: req.body.page,
                  title: req.body.title,
                  data: req.body.data
                },(modData)=>{
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



router.post('/content/delete',(req,res)=>{
  var path,pathWithoutCampus
  if(req.session.userId){
    findUsernameAsync(User,req.session.userId)
    .then((doc)=>{
      pathWithoutCampus = pathGenWithoutCampus(doc.username,req.body.info.year,req.body.info.type)
      path = pathGen(doc.username,req.body.info.year,req.body.info.type,req.body.info.campus)
      return checkFileAsync(path,pathWithoutCampus)
    })
    .then(()=>{
      return new Promise((res,rej)=>{
        fs.readFile(path,(err,data)=>{
          if(err) rej(err)
          if(data)
            res(JSON.parse(data))
        })
      })
    })
    .then((data)=>{
      let deleteObj = data[req.body.info.dimension][req.body.info.item][req.body.info.detail]
      if(deleteObj instanceof Array){
        data[req.body.info.dimension][req.body.info.item][req.body.info.detail] = deleteObj.filter((element,index)=>{
          return index != req.body.index
        })
      }
      //console.log(deleteObj)
      fs.writeFile(path,JSON.stringify(data),(err)=>{
        if(err)
          throw err
        else{
          res.status(200).send('OK')
          console.log('Deletion operation has been finished')
        }
      })
    })
    .catch((err)=>{
      if(err) console.log(err)
    })
  }
})
module.exports= router