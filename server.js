import http from 'http'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import config from 'projectRoot/config.js'
import auth from 'auth/app.js'
import midLongTerm from 'mid-long-term/app.js'
// import shortTerm from 'short-term/app.js'
const isDevMode = process.env.NODE_ENV == 'development'

const server = express()

http.createServer(server)
server.listen(config.server.port)

if(isDevMode){
  server.use(logger('dev'))
}

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

server.use('/auth', auth)
server.use('/mid-long-term', midLongTerm)
// server.use('/short-term', shortTerm)


server.use((req, res) => {
  if(req.session.userId)
    res.redirect('/auth/channel')
  else
    res.redirect('/auth/login')
})

