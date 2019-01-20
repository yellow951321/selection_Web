const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const YearRouter = require('./year')
const TypeRouter = require('./type')
const CampusRouter = require('./campus')
const ProjectRouter = require('./project')
const FileRouter = require('./opera/file')
const ContentRouter = require('./opera/content')

router.use('/:userId',(req,res,next)=>{
  if(req.session && req.session.userId == req.params.userId){
    next()
  }else{
    res.redirect('/auth/login')
  }
})

router.use('/:userId/file',FileRouter)
router.use('/:userId/content',ContentRouter)

router.use('/:userId/:year/:type/:campus',ProjectRouter)

router.use('/:userId/:year/:type',(req,res,next)=>{
  req.session.year = req.params.year
  req.session.type = req.params.type
  if(req.session.campus)
    req.session.campus = null
  next()
},CampusRouter)

router.use('/:userId/:year',(req,res,next)=>{
  req.session.year = req.params.year
  if(req.session.type)
    req.session.type = null
  if(req.session.campus)
    req.session.campus = null
  console.log(req.session)
  next()
},TypeRouter)

router.use('/:userId',(req,res,next)=>{
  if(req.session.year)
    req.session.year = null
  if(req.session.type)
    req.session.type = null
  if(req.session.campus)
    req.session.campus = null
  next()
},YearRouter)

module.exports = router