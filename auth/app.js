/**
 * @file The Auth app root route
 * @module userApp
 * @name userApp
 * @requires express
 * @requires path
 * @requires cookie-parser
 * @requires 'auth/models/schemas/user.js'
 * @requires 'auth/models/schemas/session.js'
 * @requires 'auth/models/operations/sync-session.js'
 */
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
/**
 * Set the views to the specified directory: views -> auth/views
 */
app.set('views', path.join(config.projectRoot, 'auth/views'))
// Define the `view engine` to `pug(jade)`
/**
 * Define the `view engine` to `pug(jade)`
 */
app.set('view engine', 'pug')
/**
 * Mounts the /public route path to a static directory
 */
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
/**
 * check the sessionId in the cookie if its status is 'login' (stored in database) automatically login
 */
app.use(async(req, {}, next) => {
  try {
    // Parse a cookie value as a signed cookie
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']
    // check the request session with syncSession
    await syncSession(req, sessionId)
    // pass this request to the next route
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

/**
 * The login route
 */
app.route('/login')
  // if the request have been loginned, it will redirect to /auth/channel/
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
  // if the request hasn't loginned, create a session to this user
  .post(async(req, res, next)=>{
    try{
      // find the user whether it has sign up in database
      const data = await User.findOne({
        where:{
          account: req.body.username,
          password: req.body.password,
        },
      })
      if(data != null){
        // create a session of the user to the database
        req.session.userId = data.userId
        Session.create({
          sessionId: req.session.id,
          expiration: Number(req.session.cookie.expires),
          userId: data.userId,
        })
        // redirect to /auth/login
        res.redirect('/auth/login')
      }else{
        // error handling
        const err = new Error(`No account matched ${req.body.username}.`)
        err.status = 401
        throw err
      }
    }
    catch(err){
      // error handling
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to perform POST at route `/auth/login`')
        err.status = 400
        next(err)
      }
    }
  })

/**
 * The /channel route
 */
app.get('/channel', async(req, res, next)=> {
  try {
    if(req.session && req.session.userId){ // check the session whether is existed.
      // find the information of the user
      let user = await User.findOne({
        where:{
          userId: req.session.userId,
        },
      })
      // render a channel page back
      res.render('channel', {
        user: user.account,
      })
    }
    else
      // if not, redirect to /auth/channel
      res.redirect('/auth/channel')
  }
  catch (err){
    // error handling
    next(err)
  }
})

/**
 * The /logout route
 */
app.get('/logout', async(req, res, next)=>{
  try {
    // remove session and remove the login record in the database
    await Session.destroy({
      where: {
        sessionId: req.session.id,
      },
    })
    // remove the session in the request
    req.session.destroy()
    // redirect to /auth/login
    res.redirect('/auth/login')
  } catch (err) {
    // error handling - pass to the error handling route
    if(err.status)
      next(err)
    else {
      err = new Error('Failed to GET at route `/auth/logout`.')
      err.status = 500
      next(err)
    }
  }
})
/**
 * @todo need to be remove in the future
 * @name route/signup
 * @inner
 * @function
 * @param {string} path - Express path
 */
app.route('/signup')
  .get(({}, res, next)=>{
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
  .post(async(req, res, next)=>{
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
/**
 * The error handling route
 * @name route/errorHandling
 * @inner
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
app.use(({}, {}, next)=>{
  // create a error message with page not found
  const err = new Error('Page not found.')
  err.status = 404
  next(err)
})
/**
 * The error handling route used to render the error page
 * @name route/errorRender
 * @inner
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
app.use((err, {}, res, {})=>{
  // render the error page
  res.render('error', err)
})


export default app