// import http from 'http'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import config from 'projectRoot/config.js'
import auth from 'auth/app.js'
import midLongTerm from 'mid-long-term/app.js'
import shortTerm from 'short-term/app.js'
import https from 'https'
import fs from 'fs'
const isDevMode = process.env.NODE_ENV == 'development'

let options = {
  key: fs.readFileSync('key/private.key'),
  ca: fs.readFileSync('key/ca_bundle.crt'),
  cert: fs.readFileSync('key/certificate.crt'),
}

const httpsExpressServer = express()
const httpsServer = https.createServer(options, httpsExpressServer)
httpsServer.listen(config.server.port)
//http.createServer(server)
//server.listen(config.server.port)

if(isDevMode){
  httpsExpressServer.use(logger('dev'))
}

httpsExpressServer.use(cookieParser())
httpsExpressServer.use(express.json({
  inflate: true,
  limit: '5GB',
  strict: true,
  type: 'application/json',
}))
httpsExpressServer.use(express.urlencoded({
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

httpsExpressServer.use(session({
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

httpsExpressServer.use('/auth', auth)
httpsExpressServer.use('/mid-long-term', midLongTerm)
httpsExpressServer.use('/short-term', shortTerm)
httpsExpressServer.use('/.well-known', async(req, res, next)=> {
  try{
    res.send('TxW8yW_TwklmhaK3mQDy2QJwTTPHDRFl1bfj5wdJeLY._ZFHxgVyOdaDiygbg4eJnYhtMExAtTE72Aa0ZMC_e7I')
  }
  catch(err){
    next(err)
  }
})


httpsExpressServer.use((req, res) => {
  if(req.session.userId)
    res.redirect('/auth/channel')
  else
    res.redirect('/auth/login')
})
