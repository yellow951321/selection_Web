const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const User = require('../../../models/newModel/schema/User')

const { countAllCampusMethodCorToOneCampus,
        countOneCampusMethodCorToAspect,
        countOneCampusMethodCorToAspectKey } = require('../../../data/operation/draw')
const { map, getFromWord, } = require('../../../data/operation/mapping')


router.get('/filter', async (req,res)=>{
  try{
    console.log(req.query)
    let data
    if(req.query.method == ''){ // choose whole keypoint
      data = await countOneCampusMethodCorToAspect({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type}),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect })
      })
    }else if(req.query.method){ // choose whle method
      data = await countOneCampusMethodCorToAspectKey({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type }),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect }),
        keypoint: getFromWord(map, { item: req.query.keypoint })
      })
    }
    res.json(data)
  }catch(err){
    console.log(new Error(err))
  }
})
router.get('/all',async (req,res)=>{
  try{
    console.log(req.query)
    let data = await countAllCampusMethodCorToOneCampus({
      campus: getFromWord(map, { campus: req.query.campus, type: req.query.type}),
      year: req.query.year,
      type: getFromWord(map, {type: req.query.type }),
      userId: req.session.userId
    })
    res.json(data)
  }catch(err){

  }
})


router.get('/', async (req,res)=>{
  try{

    const user = await User.findOne({
      where: {
        userId: req.session.userId
      }
    })

    if( user == null)
      throw new Error(`No User Id named ${req.session.userId}`)
    else
      var {dataValues, } = user

    res.render('manage/graph.pug',{
      GLOBAL:{
        id: req.session.userId,
        user: dataValues.account,
        year: res.locals.year,
        type: res.locals.type,
        campus: res.locals.campus
      },
    })
  }catch (err){
    console.log(err)
  }
})



module.exports = router
