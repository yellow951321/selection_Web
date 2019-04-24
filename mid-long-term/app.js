import path from 'path'
import express from 'express'

import config from 'projectRoot/config.js'
import User from 'projectRoot/auth/models/schemas/user.js'
import typeRouter from 'mid-long-term/routes/type.js'
import campusRouter from 'mid-long-term/routes/campus.js'
import yearRouter from 'mid-long-term/routes/year.js'
import fileRouter from 'mid-long-term/routes/file.js'


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

app.use('/:userId',async (req,res,next)=>{
  console.log(req.session)
  if(req.session && req.session.userId == req.params.userId){
    const data = await User.findOne({
      where:{
        userId: req.session.userId
      }
    })
    if(data != null)
      res.locals.user = data.dataValues.account
    next()
  }else{
    res.redirect('/auth/login')
  }
})

app.use('/:userId', typeRouter )

app.use('/:userId/file', fileRouter )

app.use('/:userId/:typeId', async(req,res,next)=>{
  res.locals.typeId = req.params.typeId
  next()
},
campusRouter)

app.use('/:userId/:typeId/:campusId', async(req,res,next)=>{
  res.locals.campusId = req.params.campusId
  next()
},
yearRouter)

app.use('/:userId/:typeId/:campusId/:year', async(req,res,next)=>{
  res.locals.year = req.params.year
  next()
},
yearRouter)

// app.use('/:userId/downloadCsv')

export default app
