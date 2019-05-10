import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import syncSession from 'auth/models/operations/sync-session.js'

const app = express()

app.locals.GLOBAL = {
  config,
}
app.set('views', path.join(config.projectRoot, 'auth/views'))
app.set('view engine', 'pug')

app.use('/public', express.static(`${config.projectRoot}/auth/public`, {
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

// check the sessionId in the cookie
// if it's status 'login' (stored in database)
// automatically login
app.use(async(req, {}, next) => {
  try {
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']

    await syncSession(req, sessionId)
    next()
  }
  catch (err) {
    if(err.status)
      next(err)
    else {
      err = new Error('Failed to setup session.')
      err.status = 500
      next(err)
    }
  }
})

app.route('/login')
  .get(async(req, res, next)=>{
    try {
      if(req.session && req.session.userId)
        res.redirect('/auth/channel')
      else
        res.render('login')
    }
    catch(err){
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to GET at route `/auth/login`.')
        next(err)
      }
    }
  })
  .post(async(req, res, next)=>{
    try{
      const data = await User.findOne({
        where:{
          account: req.body.username,
          password: req.body.password,
        },
      })
      if(data != null){
        req.session.userId = data.userId

        Session.create({
          sessionId: req.session.id,
          expiration: Number(req.session.cookie.expires),
          userId: data.userId,
        })

        res.redirect('/auth/login')
      }else{
        const err = new Error(`No account matched ${req.body.username}.`)
        err.status = 401
        throw err
      }
    }
    catch(err){
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to perform POST at route `/auth/login`')
        err.status = 400
        next(err)
      }
    }
  })

app.get('/channel', async(req, res, next)=> {
  try {
    if(req.session && req.session.userId){
      let user = await User.findOne({
        where:{
          userId: req.session.userId,
        },
      })
      res.render('channel', {
        user: user.account,
      })
    }
    else
      res.redirect('/auth/channel')
  }
  catch (err){
    next(err)
  }
})

app.get('/logout', async(req, res, next)=>{
  try {
    // remove session and remove the login record in the database
    await Session.destroy({
      where: {
        sessionId: req.session.id,
      },
    })
    req.session.destroy()

    res.redirect('/auth/login')
  } catch (err) {
    if(err.status)
      next(err)
    else {
      err = new Error('Failed to GET at route `/auth/logout`.')
      err.status = 500
      next(err)
    }
  }
})

app.route('/signup')
  .get(({}, res)=>{
    try {
      res.render('signup')
    }
    catch (err) {
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to GET at route `/auth/singup`')
        err.status = 500
        next(err)
      }
    }
  })
  .post(async(req, res)=>{
    try{
      const user = await User.create({
        account : req.body.account,
        password: req.body.password,
      })
      if(user)
        res.redirect('/auth/login')
      else
        throw new Error()
    }
    catch (err){
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to POST at route `/auth/signup`.')
        err.status = 500
        next(err)
      }
    }
  })

app.use(({}, {}, next)=>{
  const err = new Error('Page not found.')
  err.status = 404
  next(err)
})
app.use((err, {}, res, {})=>{
  res.render('error', err)
})


export default app