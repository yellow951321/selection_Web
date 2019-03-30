const express = require('express')
const path = require('path')
const session = require('express-session')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

import config from './config.js';
const auth = require('routes/auth')
const sequelize = require('./db/mariadb')
const AuthRouter = require('routes/manage/auth')
const apiRouter = require('apis/apiRouter')

const Session = require('models/schema/Session')

const app = express()

const isDevMode = process.env.MODE == 'DEVELOPMENT'

//test the connection of sequelize
sequelize
  .authenticate()
  .then(()=>{
    console.log('Connection has been established successfully')
  })
  .catch(err => {
    console.error('Unable to connect to the database', err)
  })

// view engine setup
app.set('views', path.join(config.path, 'views'))
app.set('view engine', 'pug')

if(isDevMode){
  app.use(logger('dev'))
}

// cookie parser
app.use(cookieParser())

// json parser for http body
app.use(express.json({
  // request body can be compressed
  inflate: true,
  // maximum body size
  limit: '5GB',
  // data can only be JSON format
  strict: true,
  // supported MIME type
  type: 'application/json',
}))

// url encode middleware
app.use(express.urlencoded({
  // use qs library to parse URL-encoded data
  extended: true,
  // request body can be compressed
  inflate: true,
  // maximum body size
  limit: '5GB',
  // maximum number of query parameters
  parameterLimit: 1000,
  // supportted MIME type
  type: [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/html',
    'application/xhtml+xml',
    'application/xml',
  ],
}))

app.use(session({
  cookie: {
    path: '/',
    httpOnly: !isDevMode,
    domain: config.server.domain,
    expires: new Date(Date.now() + 1000*60*60*24*7),
    maxAge: 1000*60*60*24*7,
    sameSite: true,
    /**
     * @todo add https
     */
    // secure: isDevMode,

  },
  name: 'reddeadredemption',
  proxy: false,
  secret: config.server.secret,
  resave : false,
  rolling: false,
  saveUninitialized : false,
  unset: 'destroy',
}))

app.use('/static', express.static(path.join(__dirname, 'public'), {
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

// check the sessionId in the cookie
// if it's status 'login' (stored in database)
// automatically login
app.use(async(req, res, next) => {
  let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['reddeadredemption']

  // sessionId will be reset after restarting server
  // we need to update session after every connection
  if(sessionId !== req.session.id){
    let doc = await Session.findOne({
      where: {
        sessionId,
      },
    })
    if(doc !== null){
      if(Number(doc.expiration) > Date.now()){
        req.session.userId = doc.userId
        await doc.update({
          sessionId: req.session.id,
        })
      }
      else if(Number(doc.expiration) < Date.now()){
        await doc.destroy()
      }
    }
  }
  next()
})

// resolve /auth router
app.use('/auth', auth)

// resolve /man router
app.use('/man', AuthRouter)

// resolve /apis router
app.use('/apis', apiRouter)


app.use((req, res, next)=>{
  if(!req.session.userId){
    res.redirect('/auth/login')
  }
  else if(req.session && req.session.userId)
    res.redirect(`/man/${req.session.userId}`)
  else
    next()
})

app.listen(config.server.port)
