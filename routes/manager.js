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


router.post('/add', (req, res)=>{
  const pathWithoutName = pathGenWithoutName(username, req.body.info.year, req.body.info.type, req.body.info.campus)
  const path = pathGen(username, req.body.info.year, req.body.info.type, req.body.info.campus, req.body.info.name)
  fs.stat(path, (err, state)=>{
    if(err){
      console.log(err)
      fs.mkdir(pathWithoutName, {recursive:true, }, (err)=>{
        if(err) console.log(err)
        console.log('mkdir operation complete')
        fs.copyFile('data/projectSchema.json', path, (err)=>{
          if(err) console.log(err)
          else
            console.log('Mdir operation is completed')
          const info = {
            username : username,
            year : req.body.info.year,
            type : req.body.info.type,
            campus : req.body.info.campus,
          }
          fetch(info, (files)=>{
            if(files instanceof Array && req.body.info.campus){
              splitArrayIntoContext(files, (context)=>{
                // console.log(context);
                res.status(200).send('OK')
              })
            }
          })
          fs.readFile(path, (err, data)=>{
            if(err) console.log(err)
            if(data){
              data = JSON.parse(data)
              data['年度'] = req.body.info.year
              fs.writeFile(path, JSON.stringify(data), (err)=>{
                if(err) console.log(err)
                console.log('save operation have been completed')
              })
            }
          })
        })
      })
    }else if(state){
      fs.copyFile('data/projectSchema.json', path, (err)=>{
        if(err) console.log(err)
        else
          console.log('Mdir operation is completed')
        const info = {
          username : username,
          year : req.body.info.year,
          type : req.body.info.type,
          campus : req.body.info.campus,
        }
        fetch(info, (files)=>{
          if(files instanceof Array && req.body.info.campus){
            splitArrayIntoContext(files, (context)=>{
              console.log(context)
              res.status(200).send('OK')
            })
          }
        })
      })
    }
  })
  //res.render('manage/_render_manage',{info:[req.body.info]});
})

router.post('/save', (req, res)=>{
  const account = sessionTable.findBySId(req.body.sessionId)
  // console.log(req.body);
  if(account){
    const username = account.username
    const year = req.body.info.year
    const type = req.body.info.type
    const campus = req.body.info.campus
    const name = req.body.info.name
    const data = req.body.data
    const pathWithName = pathGen(username, year, type, campus, name)
    const path = pathGenWithoutName(username, year, type, campus)
    fs.stat(pathWithName, (err, state)=>{
      if(err){
        fs.mkdir(path, {recursive: true, }, (err)=>{
          if(err) return console.log(err)
          console.log(`make dir and files in ${path}`)
          nodeToObj('data/projectSchema.json', data, (modData)=>{
            fs.writeFile(pathWithName, JSON.stringify(modData), (err)=>{
              if(err) return console.log(err)
              console.log(`Save ${pathWithName} is completed`)
              return res.status(200).send('OK')
            })
          })
        })
      }else if(state){
        nodeToObj('data/projectSchema.json', data, (modData)=>{
          // console.log(modData);
          fs.writeFile(pathWithName, JSON.stringify(modData), (err)=>{
            if(err) return console.log(err)
            console.log(`Save ${pathWithName} is completed`)
            return res.status(200).send('OK')
          })
        })
      }
    })
  }else{
    res.status(400).send('No sessionId')
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
router.get('/test', (req, res)=>{

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
    res.write('<a href="http://localhost:11021/log">Click Here</a>')
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
    res.write('<a href="http://localhost:11021/log">Click Here</a>')
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
            res.render('manage/manage', {info: files, })
          }
        })
      }
    })
  }else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:11021/log">Click Here</a>')
    res.send()
  }
})

router.get('/:username/:year/:type/:campus', (req, res)=>{
  if(req.session.userId){
  //   User.findOne({
  //     id: req.session.userId
  //   },(err,doc)=>{
  //     if(err) console.log(err)
  //     if(doc){
  //       console.log(doc)
  //       fetch({
  //         username: doc.username,
  //         year: req.params.year,
  //         type : req.params.type,
  //         campus : req.params.campus
  //       }, (files)=>{
  //         if(files instanceof Array){
  //           res.render('manage/select', {contents: files, })
  //         }
  //       })
  //     }
  // })
    res.render( 'manage/edit' );
  }
  else{
    res.writeHead(403, {'Content-Type':'text/html', })
    res.write('<h2>403 Forbidden </h2>')
    res.write('<p>No session Id or your sessionId is expired</p>')
    res.write('<p>Please redirect to the log page</p>')
    res.write('<a href="http://localhost:11021/log">Click Here</a>')
    res.send()
  }
})


router.post('/addContent', (req, res)=>{
  res.render('manage/newEdit')
})

router.post('/delete', (req, res)=>{
  const username = req.session.username
  const year = req.body.info.year
  const type = req.body.info.type
  const campus = req.body.info.campus
  const name = req.body.info.name
  const oldPath = pathGen(username, year, type, campus, name)
  const newPath = pathGenDeleteName(username, year, type, campus, name)
  console.log(oldPath)
  console.log(newPath)
  if(account){
    fs.rename(oldPath, newPath, (err)=>{
      if(err) console.log(err)
      console.log(`rename completed with ${newPath}`)
      res.status(200).send('OK')
    })
  }else{
    res.status(400).send('No sessionId')
  }

})

function pathGen(username, year, type, campus, name){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus+'/'+year+'_'+type+'_'+campus+'_'+name+'.json'
}
function pathGenWithoutName(username, year, type, campus){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus
}

function pathGenDeleteName(username, year, type, campus, name){
  return 'data/'+username+'/'+year+'/'+type+'/'+campus+'/'+year+'_'+type+'_'+campus+'_'+name+'_'+'d'+'.json'
}
function fetch(info, cb){
  const username = info.username ? `/${info.username}`: ''
  const year = info.year ? `/${info.year}` : ''
  const type = info.type ? `/${info.type}` : ''
  const campus = info.campus ? `/${info.campus}` : ''
  const proName = info.proName ? `/${info.year +'_'+info.type+'_'+info.campus+'_'+info.proName+'.json'}` : ''
  const path = 'data'+username+year+type+campus+proName
  // console.log(path);
  if(proName != ''){
    fs.readFile(path, 'utf-8', (err, data)=>{
      if(err) return console.log(err)
      if(data){
        cb(JSON.parse(data))
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
    let t = {}
    var content = name.split('_')
    if(content.length <= 4){
      t.year = content[0]
      t.type = content[1]
      t.campus = content[2]
      t.name = content[3].match(/[^.]+/)[0]
      temp.push(t)
    }
  }
  cb(temp)
}


function objToNode(project, cb){
  // console.log(project);
  var context = []
  for(dimension in project)
    for(item in project[dimension])
      for(detail in project[dimension][item]){
        // console.log(detail);
        //console.log(detail.length > 0);
        if(project[dimension][item][detail] instanceof Array && project[dimension][item][detail].length > 0){
          for(content of project[dimension][item][detail]){
            let t = {}
            t.dimension = dimension
            t.item = item
            t.detail = detail
            t.content = content.paragraph
            t.page = {}
            t.page.start = '1'
            t.page.end = '1'
            // console.log("Adding");
            context.push(t)
          }
        }
      }

  cb(context)
}

function nodeToObj(path, body, cb){
  fs.readFile(path, 'utf-8', (err, data)=>{
    if(err) return console.log(err)
    if(data){
      data = JSON.parse(data)
      // console.log(body);
      if(body instanceof Array){
        for(con of body){
          // console.log(con);
          var item = new ContentSchema(con.page, con.content)
          data[con.dimension][con.item][con.detail].push(item)
        }
      }
      cb(data)
    }
  })




}




function ContentSchema(page, paragraph){
  if(page.start && page.end){
    this.page = []
    this.page[0] = page.start
    this.page[1] = page.end
  }
  this.paragraph = paragraph ? paragraph : ''
  this.title = ''
}
module.exports= router