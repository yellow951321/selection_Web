import path from 'path'
import express from 'express'

import authUser from 'lib/middleware/auth.js'

import config from 'projectRoot/config.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import typeRouter from 'short-term/routes/type.js'
import yearRouter from 'short-term/routes/year.js'
import reviewRouter from 'short-term/routes/review.js'
import campusRouter from 'short-term/routes/campus.js'
import dataRouter from 'short-term/routes/data.js'
import contentRouter from 'short-term/routes/content.js'
import downloadRouter from 'short-term/routes/downloadCsv.js'

const app = express()
app.locals.GLOBAL = {
  config,
  campusMap,
}

app.set('views', path.join(config.projectRoot, 'short-term/views'))
app.set('view engine', 'pug')
app.use('/public', express.static(`${config.projectRoot}/short-term/public`, {
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

app.use('/', yearRouter)

app.use('/data', dataRouter)

app.use('/content', contentRouter)

app.use('/download', downloadRouter)

app.use('/:yearId', (req, res, next)=>{
  const yearId = Number(req.params.yearId)
  if(typeof yearId === 'number'){
    res.locals.yearId = yearId
    next()
  }
  else{
    res.status(400).render('error', {
      status: 400,
      message: 'invaliad type',
    })
  }
},
typeRouter)

app.use('/:yearId/review', reviewRouter)

app.use('/:yearId/:typeId', (req, res, next)=>{
  const typeId = Number(req.params.typeId)
  if(typeof typeId === 'number'){
    res.locals.typeId = typeId
    next()
  }
  else{
    res.status(400).render('error', {
      status: 400,
      message: 'invaliad type',
    })
  }
},
campusRouter)

app.use((err, {}, res, {}) => {
  res.render('error', {
    message: err,
    error: err,
  })
})

export default app
