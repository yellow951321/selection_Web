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
 * Check the sessionId in the cookie if its status is `login` or not.(stored in database)
 * automatically login
 * @name checkSession
 * @inner
 * @function
 */
app.use(async(req, {}, next) => {
  try {
    /** Parse a cookie value as a signed cookie*/
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']
    /** Check the request session with syncSession*/
    await syncSession(req, sessionId)
    /** Pass this request to the next route*/
    next()
  }
  catch (err) {
    /**
     * Check the error message whether having error status or not.
     * If the error message contains the status code, representing this error has been identified.
     * It no need to setup another error status code.
     * Otherwise, we set its status code to 500.
     */
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
 * @name login
 * @inner
 * @function
 */
app.route('/login')
  /**
   * If the request have been loginned,
   * it will redirect to /auth/channel.
   * Otherwise, It will redirect to `/login route`.
   */
  .get(async(req, res, next)=>{
    try {
      if(req.session && req.session.userId)
        res.redirect('/auth/channel')
      else
        res.render('login')
    }
    catch(err){
    /**
     * Check the error message whether having error status or not.
     * If the error message contains the status code, representing this error has been identified.
     * It no need to setup another error status code.
     * Otherwise, we set its status code to 500.
     */
      if(err.status)
        next(err)
      else {
        err = new Error('Failed to GET at route `/auth/login`.')
        next(err)
      }
    }
  })
  /**
   * Get a `POST` method request,
   * it will check whether the user is existed or not.
   * if existed, it will create a session to the user
   * and store the session to the database.
   */
  .post(async(req, res, next)=>{
    try{
      /** Find the user whether it has signed up or not*/
      const data = await User.findOne({
        where:{
          account: req.body.username,
          password: req.body.password,
        },
      })
      /**
       * If the user is exitsted, create a new session to the database.
       * It will store three properties
       * 1. {number} sessionId - A unique hash id to this session
       * 2. {number} exiration - The time to record how long this session will be expired.
       * 3. {number} userId - The ID of user
      */
      if(data != null){
        /** Create a session of the user to the database */
        req.session.userId = data.userId
        Session.create({
          sessionId: req.session.id,
          expiration: Number(req.session.cookie.expires),
          userId: data.userId,
        })
        /** Redirect to /auth/login*/
        res.redirect('/auth/login')
      }else{
        /**
         * Error handling
         * If there is no username match request,
         * it will throw a error message with status
         * code,`401`
        */
        const err = new Error(`No account matched ${req.body.username}.`)
        err.status = 401
        throw err
      }
    }
    catch(err){
    /**
     * Check the error message whether having error status or not.
     * If the error message contains the status code, representing this error has been identified.
     * It no need to setup another error status code.
     * Otherwise, we set its status code to `400`.
     */
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
 * @name channel
 * @inner
 * @function
 */
app.get('/channel', async(req, res, next)=> {
  try {
    /**
     * Check the session of request
     * If session and userId are existed,
     * find username by the userId then render
     * the `channel.pug` back
     * Otherwise, Redirect to /auth/channel
     */
    if(req.session && req.session.userId){
      /**
       * Find the information of the user by userId
       */
      let user = await User.findOne({
        where:{
          userId: req.session.userId,
        },
      })
      /**
       * Render a `channel.pug` back
       * with `user.account` information.
       */
      res.render('channel', {
        user: user.account,
      })
    }
    else
      res.redirect('/auth/channel')
  }
  catch (err){
    /** Pass thie error message to next route */
    next(err)
  }
})

/**
 * The logout route
 * @name logout
 * @function
 */
app.get('/logout', async(req, res, next)=>{
  try {
    /**
     * Remove session in the database
     */
    await Session.destroy({
      where: {
        sessionId: req.session.id,
      },
    })
    /**
     * remove the session in the request,
     * then redirect to `/auth/login` route.
     */
    req.session.destroy()
    res.redirect('/auth/login')
  } catch (err) {
    /**
     * Check the error message whether having error status or not.
     * If the error message contains the status code, representing this error has been identified.
     * It no need to setup another error status code.
     * Otherwise, we set its status code to `500`.
     */
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
 * Sign up route, it will be removed in the future
 * @name signup
 * @inner
 * @function
 * @todo it will be removed in the future.
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
 * @name errorHandling
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
 * @name errorRender
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