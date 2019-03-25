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
const downloadCsvRouter = require('./opera/downloadCsv')
const d3Router = require('./opera/graph')

router.use('/:userId', (req, res, next)=>{
  if(req.session && req.session.userId == req.params.userId){
    next()
  }else{
    res.redirect('/auth/login')
  }
})

router.use('/:userId/file', fileRouter)
router.use('/:userId/content', contentRouter)
router.use('/:userId/downloadCsv', downloadCsvRouter)

router.use('/:userId', yearRouter)

router.use('/:userId/:year',
  async(req, res, next)=>{
    res.locals.year = req.params.year
    next()
  },
  typeRouter)

router.use('/:userId/:year/:type',
  async(req, res, next)=>{
    res.locals.type = req.params.type
    next()
  },
  campusRouter)

router.use('/:userId/:year/:type/:campus/graph',
  async(req, res, next)=>{
    res.locals.campus = req.params.campus
    next()
  },
  d3Router)

router.use('/:userId/:year/:type/:campus',
  async(req, res, next)=>{
    res.locals.campus = req.params.campus
    next()
  },
  projectRouter)



module.exports = router