const express = require('express')
const path = require('path')
const session = require('express-session')
const logger = require('morgan')

const config = require('./config')
const auth = require('./routes/auth')
const sequelize = require('./db/mariadb')
const AuthRouter = require('./routes/manage/auth')
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
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

if(isDevMode){
  app.use(logger('dev'))
}

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
  // 404 for request dot files
  dotfiles: 'ignore',
  // file hash
  etag: true,
  // handle missing extension for static file
  extensions: ['css', 'js', ],
  // when 404, pass handle to other middleware
  fallthrough: true,
  // static file can be cached
  immutable: false,
  // index file not exist
  index: false,
  // last modified date equal to file modified date on file system
  lastModified: true,
  // expired time: 1 week
  maxAge: 1000*60*60*24*7,
  // do not redirect to trailing '/'
  redirect: false,
  // add timestamp for test
  setHeaders(res, path, stat){
    res.set('x-timestamp', Date.now())
  },
}))


app.use('/auth',auth)
app.use('/man', AuthRouter)
//app.use('/',AuthRouter)
app.use((req, res, next)=>{
  if(!req.session)
    res.redirect('/login')
  else
    next()
})

app.listen(config.server.port)
