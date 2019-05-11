import express from 'express'

import {
  countCampusAll,
  countCampusRespectToAspect,
  countCampusRespectToKey,
  countCampusRespectToMethod, } from 'projectRoot/short-term/models/operations/draw.js'

import {map, getFromWord, getFromNum, } from 'projectRoot/data/operation/mapping.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res) => {
  try {
    let typeName = getFromNum(map, {type: res.locals.typeId, })
    let campusName = getFromNum(map, {
      type: res.locals.typeId,
      campus: res.locals.campusId,
    })
    res.render('manage/graph', {
      GLOBAL: {
        channel: {
          id: 'short-term',
          name: '中長程計畫',
        },
        id: req.session.userId,
        user: res.locals.user,
        type: {
          id: res.locals.typeId,
          name: typeName,
        },
        campus: {
          id: res.locals.campusId,
          name: campusName,
        },
        graph: '統計圖表',
      },
    })
  } catch(err){
    console.log(err)
  }
})


router.get('/filter', async(req, res)=>{
  try{
    let data
    if(req.query.aspect == 'All'){
      data = await countCampusAll({
        campus: req.query.campusId,
        year: req.query.year,
        type: req.query.typeId,
        userId: req.session.userId,
        percentage: req.query.percentage,
      })
    }else if(req.query.keypoint == 'All'){ // choose whole keypoint
      data = await countCampusRespectToAspect({
        campus: req.query.campusId,
        year: req.query.year,
        type: req.query.typeId,
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        percentage: req.query.percentage,
      })
    }else if(req.query.method == 'All'){ // choose whle method
      data = await countCampusRespectToKey({
        campus: req.query.campusId,
        year: req.query.year,
        type: req.query.typeId,
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        keypoint: getFromWord(map, { item: req.query.keypoint, }),
        percentage: req.query.percentage,
      })
    }else if(req.query.method){
      data = await countCampusRespectToMethod({
        campus: req.query.campusId,
        year: req.query.year,
        type: req.query.typeId,
        userId: req.session.userId,
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        keypoint: getFromWord(map, { item: req.query.keypoint, }),
        method: getFromWord(map, { detail: req.query.method, }),
        percentage: req.query.percentage,
      })
    }
    res.json(data)
  }catch(err){
    console.log(new Error(err))
  }
})



export default router