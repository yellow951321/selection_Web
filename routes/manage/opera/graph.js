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

const { countCampusAll,
        countCampusRespectToAspect,
        countCampusRespectToKey,
        countCampusRespectToMethod } = require('../../../data/operation/draw')
const { map, getFromWord, } = require('../../../data/operation/mapping')


router.get('/filter', async (req,res)=>{
  try{
    console.log(req.query)
    let data
    if(req.query.aspect == 'All'){
      data = await countCampusAll({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type}),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
      })
    }else if(req.query.keypoint == 'All'){ // choose whole keypoint
      data = await countCampusRespectToAspect({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type}),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect })
      })
    }else if( req.query.method == 'All'){ // choose whle method
      data = await countCampusRespectToKey({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type }),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect }),
        keypoint: getFromWord(map, { item: req.query.keypoint })
      })
    }else if( req.query.method ){
      data = await countCampusRespectToMethod({
        campus: getFromWord(map, { campus: req.query.campus, type: req.query.type }),
        year: req.query.year,
        type: getFromWord(map, { type: req.query.type }),
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect }),
        keypoint: getFromWord(map, { item: req.query.keypoint }),
        method: getFromWord(map, { detail: req.query.method})
      })
    }
    res.json(data)
  }catch(err){
    console.log(new Error(err))
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
        campus: res.locals.campus,
        graph: '統計圖表',
      },
    })
  }catch (err){
    console.log(err)
  }
})



module.exports = router
