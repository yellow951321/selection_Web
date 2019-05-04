import path from 'path'
import express from 'express'

import {authUser, } from 'projectRoot/lib/middleware/auth.js'

import config from 'projectRoot/config.js'
// import User from 'projectRoot/auth/models/schemas/user.js'
import typeRouter from 'mid-long-term/routes/type.js'
import reviewRouter from 'mid-long-term/routes/review.js'
import campusRouter from 'mid-long-term/routes/campus.js'
import yearRouter from 'mid-long-term/routes/year.js'
import fileRouter from 'mid-long-term/routes/file.js'
import contentRouter from 'mid-long-term/routes/content.js'
import downloadRouter from 'mid-long-term/routes/downloadCsv.js'
import graphRouter from 'mid-long-term/routes/graph.js'


const app = express()
app.locals.GLOBAL = {
  config,
}

app.set('views', path.join(config.projectRoot, 'mid-long-term/views'))
app.set('view engine', 'pug')
app.use('/static', express.static(`${config.projectRoot}/mid-long-term/public`, {
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
  setHeaders(res){
    res.set('x-timestamp', Date.now())
  },
}))


app.use(authUser)

app.use('/', typeRouter)

app.use('/:typeId', (req, res, next)=>{
  let typeId = Number(req.params.typeId)
  if(typeof typeId === 'number')
    res.locals.typeId = typeId
  else{
    res.status(400).render('error', {
      status: 400,
      message: 'invaliad type',
    })
  }
  next()
},
campusRouter)

app.use('/:typeId/:campusId', (req, res, next)=>{
  let campusId = Number(req.params.campusId)
  if(typeof campusId === 'number')
    res.locals.campusId = campusId
  else{
    res.status(400).render('error', {
      status: 400,
      message: 'invaliad campus',
    })
  }
  next()
},
yearRouter)

app.use('/:typeId/:campusId/:dataId', (req, res, next)=>{
  let dataId = Number(req.params.dataId)
  if(typeof dataId === 'number')
    res.locals.dataId = dataId
  else{
    res.status(400).render('error', {
      status: 400,
      message: 'invalid data',
    })
  }
  next()
})

app.use('/:typeId/:campusId/:dataId/graph', graphRouter)

app.use('/:typeId/:campusId/:dataId/download', downloadRouter)

app.use('/:typeId/:campusId/:dataId/file', fileRouter)

app.use('/:typeId/:campusId/:dataId/content', contentRouter)

app.use('/:typeId/:campusId/:dataId/review', reviewRouter)


export default app
