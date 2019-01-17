const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')

const config = require('./config')
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const managerRouter = require('./routes/manager')
const app = express()

const isDevMode = process.env.MODE == 'DEVELOPMENT'

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
app.use(express.urlencoded({extended: false, }))
app.use(cookieParser())
app.use(session({
  secret: config.secret,
}))
app.use('/static', express.static(path.join(__dirname, 'public'), {
  // 404 for request dot files
  dotfiles: 'ignore',
  // file hash
  etag: true,
  // handle missing extension for static file
  extensions: ['css', 'js'],
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
  setHeaders(res,path,stat){
    res.set('x-timestamp', Date.now())
  },
}))

app.use('/log', loginRouter)
app.use('/signup', signupRouter)
app.use('/man', managerRouter)

app.get('/', (req, res)=>{
  // if no session
  res.redirect('/log')
})

app.listen(config.port)
