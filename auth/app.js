// import fs from 'fs'
// import express from 'express'

// import User from 'auth/models/schemas/user.js'
// import Session from 'auth/models/schemas/session.js'

const fs = require('fs')
const express = require('express')

const User = require('./models/schemas/user')
const Session = require('./models/schemas/session')

const app = express.Router()

app.get('/login', (req, res)=>{
  if(true)//req.session && req.session.userId)
    res.redirect(`/mid-long-term/0/index`)
  else
    res.render('login')
})

app.get('/mid-long-term', (req,res)=> {
  if(true)//res.session && req.session.userId)
    res.redirect(`/mid-long-term/${req.session.userId}/index`)
  else
    res.render('login')
})

app.get('/shortTerm', (req,res)=> {
  if(res.session && req.session.userId)
    res.redirect(`/shortTerm/${req.session.userId}/index`)
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

      res.redirect(`/man/${req.session.userId}`)
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