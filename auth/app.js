import express from 'express'
import path from 'path'

import config from 'projectRoot/config.js'
import login from 'auth/models/operations/login.js'
import getUserInfo from 'auth/models/operations/get-user-info.js'
import syncSession from 'auth/models/operations/sync-session.js'
import deleteSession from 'auth/models/operations/delete-session.js'

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
    let result = await syncSession({
      cookies: req.cookies,
      sessionId: req.session.id,
    })
    if(result.message === 'sync success'){
      req.session.userId = result.userId
    }
    next()
  }
  catch (err) {
    if(typeof err.status !== 'number'){
      err = new Error('Failed to setup session.')
      err.status = 500
    }
    next(err)
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
      if(typeof err.status !== 'number'){
        err = new Error('Failed to GET at route `/auth/login`.')
        err.status = 500
      }
      next(err)
    }
  })
  .post(async(req, res, next)=>{
    try{
      let result = await login({
        account: req.body.username,
        password: req.body.password,
        sessionId: req.session.id,
        expiration: req.session.cookie.expires,
      })
      req.session.userId = result.userId
      res.redirect('/auth/login')
    }
    catch(err){
      if(typeof err.status !== 'number'){
        err = new Error('Failed to perform POST at route `/auth/login`')
        err.status = 500
      }
      next(err)
    }
  })

app.get('/channel', async(req, res, next)=> {
  try {
    if(req.session && req.session.userId){
      let user = await getUserInfo({
        userId: req.session.userId,
      })
      res.render('channel', {
        user: user.account,
      })
    }
    else
      res.redirect('/auth/login')
  }
  catch (err){
    if(typeof err.status !== 'number'){
      err = new Error('failed to GET at route `/auth/channel`')
      err.status = 500
    }
    next(err)
  }
})

app.get('/logout', async(req, res, next)=>{
  try {
    // remove session and remove the login record in the database
    await deleteSession({
      sessionId: req.session.id,
    })
    req.session.destroy()

    res.redirect('/auth/login')
  } catch (err) {
    if(typeof err.status !== 'number'){
      err = new Error('Failed to GET at route `/auth/logout`.')
      err.status = 500
    }
    next(err)
  }
})

app.use(({}, {}, next)=>{
  const err = new Error('Page not found.')
  err.status = 404
  next(err)
})
app.use((err, {}, res, {})=>{
  res.render('error', {
    message: err.message,
    status: err.status,
  })
})


export default app