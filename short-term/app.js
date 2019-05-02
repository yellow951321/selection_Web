import path from 'path'
import express from 'express'

import config from 'projectRoot/config.js'
import User from 'projectRoot/auth/models/schemas/user.js'
import typeRouter from 'short-term/routes/type.js'
import campusRouter from 'short-term/routes/campus.js'
import yearRouter from 'short-term/routes/year.js'
import fileRouter from 'short-term/routes/file.js'
import contentRouter from 'short-term/routes/content.js'
import downloadRouter from 'short-term/routes/downloadCsv.js'
import graphRouter from 'short-term/routes/graph.js'


const app = express()

app.set('views', path.join(config.projectRoot, 'shrot-term/views'))
app.set('view engine', 'pug')
app.use('/static', express.static(`${config.projectRoot}/short-term/public`, {
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

app.use('/:userId', async(req, res, next)=>{
  if(req.session && req.session.userId == req.params.userId){
    const data = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })
    if(data != null)
      res.locals.user = data.dataValues.account
    next()
  }else{
    res.redirect('/auth/login')
  }
})

app.use('/:userId', typeRouter)


app.use('/:userId/:typeId', (req, res, next)=>{
  res.locals.typeId = Number(req.params.typeId)
  next()
},
campusRouter)

app.use('/:userId/:typeId/:campusId', (req, res, next)=>{
  res.locals.campusId = Number(req.params.campusId)
  next()
},
yearRouter)

app.use('/:userId/:typeId/:campusId/:year', (req, res, next)=>{
  res.locals.year = Number(req.params.year)
  next()
})

app.use('/:userId/:typeId/:campusId/:year/graph', graphRouter)

app.use('/:userId/:typeId/:campusId/:year/download', downloadRouter)

app.use('/:userId/:typeId/:campusId/:year/file', fileRouter)

app.use('/:userId/:typeId/:campusId/:year/content', contentRouter)



// app.use('/:userId/downloadCsv')

export default app
