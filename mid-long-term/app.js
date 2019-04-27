import path from 'path'
import express from 'express'

import config from 'projectRoot/config.js'
import User from 'projectRoot/auth/models/schemas/user.js'
import typeRouter from 'mid-long-term/routes/type.js'
import reviewRouter from 'mid-long-term/routes/review.js'
import campusRouter from 'mid-long-term/routes/campus.js'
import yearRouter from 'mid-long-term/routes/year.js'
import fileRouter from 'mid-long-term/routes/file.js'
import contentRouter from 'mid-long-term/routes/content.js'
import downloadRouter from 'mid-long-term/routes/downloadCsv.js'
import graphRouter from 'mid-long-term/routes/graph.js'


const app = express()

app.set('views', path.join(config.projectRoot, 'mid-long-term/views'))
app.set('view engine', 'pug')
app.use('/static', express.static( `${config.projectRoot}/mid-long-term/public`, {
  cacheControl: false,
  // 404 for request dot files
  dotfiles: 'ignore',
  // disable cache
  etag: false,
  // handle missing extension for static file
  extensions: ['css', 'js', ],
  // when 404, pass handle to other middleware
  fallthrough: true,
  // static file can be cached
  immutable: false,
  // index file not exist
  index: false,
  // disable cache
  lastModified: false,
  // disable cache
  maxAge: 0,
  // do not redirect to trailing '/'
  redirect: false,
  // add timestamp for test
  setHeaders(res, path, stat){
    res.set('x-timestamp', Date.now())
  },
}))

app.use('/',async (req,res,next)=>{
  if(req.session && req.session.userId){
    const data = await User.findOne({
      where:{
        userId: req.session.userId
      }
    })
    if(data != null){
      res.locals.user = data.dataValues.account
    }
    next()
  }else{
    res.redirect('/auth/login')
  }
})

app.use('/', typeRouter )

app.use('/:typeId', (req,res,next)=>{
  res.locals.typeId = Number(req.params.typeId)
  next()
},
campusRouter)

app.use('/:typeId/:campusId', (req,res,next)=>{
  res.locals.campusId = Number(req.params.campusId)
  next()
},
yearRouter)

app.use('/:typeId/:campusId/:year', (req,res,next)=>{
  res.locals.year = Number(req.params.year)
  next()
})

app.use('/:typeId/:campusId/:year/graph', graphRouter)

app.use('/:typeId/:campusId/:year/download', downloadRouter)

app.use('/:typeId/:campusId/:year/file', fileRouter)

app.use('/:typeId/:campusId/:year/content', contentRouter)

app.use('/:userId/:typeId/:campusId/:dataId/content',(req,res,next)=>{
  res.locals.dataId = Number(req.params.dataId)
  next()
}, contentRouter)

app.use('/:userId/:typeId/:campusId/:dataId/review',(req,res,next)=>{
  res.locals.dataId = Number(req.params.dataId)
  next()
}, reviewRouter)


export default app
