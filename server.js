import http from 'http'
import express from 'express'
import compression from 'compression'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'

import config from 'projectRoot/config.js'
import Session from 'auth/models/schemas/session.js'
import auth from 'auth/app.js'
import midLongTerm from 'mid-long-term/app.js'
// import shortTerm from 'short-term/app.js'

import userDB from 'auth/models/operations/connect.js'


const isDevMode = process.env.NODE_ENV == 'development'

const server = express()


userDB
  .authenticate()
  .then(()=>{
    console.log('Connection has been established successfully')
  })
  .catch(err => {
    console.error('Unable to connect to the database', err)
  })

http.createServer(server)
server.listen(config.server.port)

if(isDevMode){
  server.use(logger('dev'))
}

// server.set('views', path.join(config.projectRoot, ''))
// server.set('view engine', 'pug')
// server.use('/static', express.static('public'))

// server.use(compression)
server.use(cookieParser())
server.use(express.json({
  inflate: true,
  limit: '5GB',
  strict: true,
  type: 'application/json',
}))
server.use(express.urlencoded({
  extended: true,
  inflate: true,
  limit: '5GB',
  parameterLimit: 1000,
  type: [
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/html',
    'application/xhtml+xml',
    'application/xml',
  ],
}))

server.use(session({
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
  name: 'sekiro',
  proxy: false,
  secret: config.server.secret,
  resave : false,
  rolling: false,
  saveUninitialized : false,
  unset: 'destroy',
}))


// check the sessionId in the cookie
// if it's status 'login' (stored in database)
// automatically login
server.use(async(req, {}, next) => {
  let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']

  // sessionId will be reset after restarting server
  // we need to update session after every connection
  if(sessionId !== req.session.id){
    let data = await Session.findOne({
      where: {
        sessionId,
      },
    })
    if(data !== null){
      if(Number(data.expiration) > Date.now()){
        req.session.userId = data.userId
        await data.update({
          sessionId: req.session.id,
        })
      }
      else if(Number(data.expiration) < Date.now()){
        await data.destroy()
      }
    }
  }
  next()
})

server.use('/auth', auth)
server.use('/mid-long-term', midLongTerm)
// server.use('/short-term', shortTerm)


server.use( (req, res, next) => {
  if(!req.session.userId){
    res.redirect('/auth/login')
  }
  else if(req.session && req.session.userId)
    res.redirect(`/mid-long-term/${req.session.userId}/index`)
  else
    next()
})

