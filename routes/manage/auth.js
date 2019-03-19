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
    console.log(req.session)
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
    // res.locals.year_id = (await findYear(req.params.userId, res.locals.year)).year_id
    next()
  },
  typeRouter)

router.use('/:userId/:year/:type',
  async(req, res, next)=>{
    res.locals.type = req.params.type
    // mapping
    // res.locals.type_id = getFromWord(map, {type: req.params.type, })
    next()
  },
  campusRouter)

router.use('/:userId/:year/:type/:campus/graph',
  async (req, res, next)=>{
    res.locals.campus = req.params.campus
    // res.locals.campus_id = (await findCampus(res.locals.year_id, getFromWord(map, {campus: req.params.campus, type: req.params.type, }), res.locals.type_id)).campus_id
    next()
  },
  d3Router)

router.use('/:userId/:year/:type/:campus',
  async(req, res, next)=>{
    res.locals.campus = req.params.campus
    // res.locals.campus_id = (await findCampus(res.locals.year_id, getFromWord(map, {campus: req.params.campus, type: req.params.type, }), res.locals.type_id)).campus_id
    next()
  },
  projectRouter)



module.exports = router