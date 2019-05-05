import path from 'path'
import express from 'express'

import authUser from 'lib/middleware/auth.js'

import config from 'projectRoot/config.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import typeRouter from 'mid-long-term/routes/type.js'
import reviewRouter from 'mid-long-term/routes/review.js'
import campusRouter from 'mid-long-term/routes/campus.js'
import yearRouter from 'mid-long-term/routes/year.js'
import dataRouter from 'mid-long-term/routes/data.js'
import contentRouter from 'mid-long-term/routes/content.js'
import downloadRouter from 'mid-long-term/routes/downloadCsv.js'
import graphRouter from 'mid-long-term/routes/graph.js'


const app = express()
app.locals.GLOBAL = {
  config,
  campusMap,
}

app.set('views', path.join(config.projectRoot, 'mid-long-term/views'))
app.set('view engine', 'pug')
app.use('/public', express.static(`${config.projectRoot}/mid-long-term/public`, {
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

app.use('/data', dataRouter)

app.use('/content', contentRouter)

app.use('/review', reviewRouter)

// resolve choice page
app.use('/:typeId', (req, res, next)=>{
  let typeId = Number(req.params.typeId)
  if(typeof typeId === 'number'){
    res.locals.typeId = typeId
    next()
  }
  else{
    const err = new Error('invalid argument')
    err.status(400)
    next(err)
  }
},
campusRouter)

app.use('/:typeId/:campusId', (req, res, next)=>{
  let campusId = Number(req.params.campusId)
  if(typeof campusId === 'number'){
    res.locals.campusId = campusId
    next()
  }
  else{
    const err = new Error('invalid argument')
    err.status(400)
    next(err)
  }
},
yearRouter)

app.use('/:typeId/:campusId/:dataId', (req, res, next)=>{
  let dataId = Number(req.params.dataId)
  if(typeof dataId === 'number'){
    res.locals.dataId = dataId
    next()
  }
  else{
    const err = new Error('invalid argument')
    err.status(400)
    next(err)
  }
})

app.use('/:typeId/:campusId/:dataId/graph', graphRouter)

app.use('/:typeId/:campusId/:dataId/download', downloadRouter)

app.use((err, {}, res, {}) => {
  res.render('error', {
    message: err,
    error: err,
  })
})


export default app
