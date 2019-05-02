import fs from 'fs'
import express from 'express'
import path from 'path'

import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import {map, } from 'projectRoot/data/operation/mapping'

const app = express()

app.set('views', path.join(config.projectRoot, 'auth/views'))
app.set('view engine', 'pug')


app.use('/static', express.static(`${config.projectRoot}/auth/public`, {
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

app.get('/login', async(req, res)=>{
  if(req.session && req.session.userId)
    res.redirect('/auth/channel')
  else
    res.render('login')
})

app.get('/channel', async(req, res)=> {
  if(req.session && req.session.userId){
    let user = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })
    if(user != null)
      user = user.dataValues

    res.render('manage/channel', {
      GLOBAL:{
        id: req.session.userId,
        user: user.account,
        map: map.campus,
      },
    })
  }
  else
    res.render('login')
})

app.get('/mid-long-term', (req, res)=> {
  if(req.session && req.session.userId)
    res.redirect('/mid-long-term/index')
  else
    res.render('login')
})

app.get('/shortTerm', (req, res)=> {
  if(req.session && req.session.userId)
    res.redirect('/shortTerm/index')
  else
    res.render('login')
})

app.post('/login', async(req, res)=>{
  try{
    const doc = await User.findOne({
      where:{
        account: req.body.username,
        password: req.body.password,
      },
    })
    if(doc != null){
      req.session.userId = doc.dataValues.userId

      Session.create({
        sessionId: req.session.id,
        expiration: Number(req.session.cookie.expires),
        userId: doc.userId,
      })

      res.redirect('/auth/login')
    }else{
      throw new Error(`No account matched ${req.body.username}`)
    }
  }
  catch(err){
    res.status(400).render('login', {error: err.message, })
  }
})

app.get('/logout', async(req, res)=>{
  try {
    // remove session and remove the login record in the database
    await Session.destroy({
      where: {
        sessionId: req.session.id,
      },
    })
    await new Promise((res, rej) => {
      req.session.destroy((err)=>{
        if(err)
          rej(err)
        res()
      })
    })
      .catch((err) => {
        throw err
      })
    res.status(200).redirect('/auth/login')
  } catch (err) {
    res.status(404).render('error', {'message': err.message, 'error':{'status': '404', 'stack': 'error', }, })
  }
})

app.get('/signup', (req, res)=>{
  res.render('signup')
})

app.post('/signup', async(req, res)=>{
  var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi')
  try{
    if(rMatch.test(req.body.username) || rMatch.test(req.body.password))
      throw new Error('Forbidden password or account')

    const promise = await User.create({
      account : req.body.username,
      password: req.body.password,
    })

    if(promise){
      await new Promise((resolve, reject)=>{
        fs.mkdir(`data/${req.body.username}`, {recursive: true, }, (err)=>{
          if(err) reject(err)
          resolve(true)
        })
      })
    }

    res.status(200).send('OK')
  }
  catch (err){
    res.status(400).render('signup', {error:err.message, })
  }
})

export default app