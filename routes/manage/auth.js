const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const yearRouter = require('./year')
const typeRouter = require('./type')
const campusRouter = require('./campus')
const projectRouter = require('./project')
const fileRouter = require('./opera/file')
const contentRouter = require('./opera/content')

router.use('/:userId',(req,res,next)=>{
  if(req.session && req.session.userId == req.params.userId){
    next()
  }else{
    res.redirect('/auth/login')
  }
})

router.use('/:userId/file',fileRouter)
router.use('/:userId/content',contentRouter)

router.use('/:userId/:year/:type/:campus',
(req,res,next)=>{
  res.locals.year = req.params.year
  res.locals.type = req.params.type
  res.locals.campus = req.params.campus
  next()
},
projectRouter)

router.use('/:userId/:year/:type',
(req,res,next)=>{
  res.locals.year = req.params.year
  res.locals.type = req.params.type
  next()
},
campusRouter)

router.use('/:userId/:year',
(req,res,next)=>{
  res.locals.year = req.params.year
  next()
},
typeRouter)

router.use('/:userId',
(req,res,next)=>{
  next()
},
yearRouter)

module.exports = router