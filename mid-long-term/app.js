import path from 'path'
import express from 'express'

import config from 'projectRoot/config.js'
import indexRouter from 'mid-long-term/routes/index.js'
import typeRouter from 'mid-long-term/routes/type.js'
import campusRouter from 'mid-long-term/routes/campus.js'
import yearRouter from 'mid-long-term/routes/year.js'
import fileRouter from 'mid-long-term/routes/file.js'

const app = express()

app.set('views', path.join(config.projectRoot, 'mid-long-term/views'))
app.set('view engine', 'pug')

app.use('/static', express.static(path.join(config.projectRoot, 'mid-long-term/publics'), {
  cacheControl: false,
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css', 'js', ],
  fallthrough: true,
  immutable: false,
  index: false,
  lastModified: false,
  maxAge: 0,
  redirect: false,
  setHeaders(res){
    res.set('x-timestamp', Date.now())
  },
}))

app.use('/:userId',(req,res,next)=>{
  if(res.session && res.session.userId == req.params.userId){
    next()
  }else{
    res.redirect('/auth/login')
  }
})

app.use('/:userId', indexRouter )

app.use('/:userId/file', fileRouter)

app.use('/:userId/:typeId', async(req,res,next)=>{
  res.locals.typeId = req.params.typeId
  next()
},
typeRouter)

app.use('/:userId/:typeId/:campusId', async(req,res,next)=>{
  res.locals.campusId = req.params.campusId
  next()
},
campusRouter)

app.use('/:userId/:typeId/:campusId/:year', async(req,res,next)=>{
  res.locals.year = req.params.year
  next()
},
yearRouter)

app.use('/:userId/downloadCsv')

export default app
