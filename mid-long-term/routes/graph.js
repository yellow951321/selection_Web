import express from 'express'

import {
  countCampusAll,
  countCampusRespectToAspect,
  countCampusRespectToKey,
  countCampusRespectToMethod, } from 'projectRoot/mid-long-term/models/operations/draw.js'

import {map, getFromWord, getFromNum, } from 'projectRoot/data/operation/mapping.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

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
    res.render('graph', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        {
          id: res.locals.typeId,
          name: typeName
        },
        {
          id: res.locals.campusId,
          name: campusName
        }
      ],
      channel: {
        id: 'mid-long-term',
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
        dataId: res.locals.dataId,
      })
    }else if(req.query.keypoint == 'All'){ // choose whole keypoint
      data = await countCampusRespectToAspect({
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        dataId: res.locals.dataId,
      })
    }else if(req.query.method == 'All'){ // choose whle method
      data = await countCampusRespectToKey({
        dataId: res.locals.dataId,
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        keypoint: getFromWord(map, { item: req.query.keypoint, }),
      })
    }else if(req.query.method){
      data = await countCampusRespectToMethod({
        dataId: res.locals.dataId,
        aspect: getFromWord(map, { dimension: req.query.aspect, }),
        keypoint: getFromWord(map, { item: req.query.keypoint, }),
        method: getFromWord(map, { detail: req.query.method, }),
      })
    }

    let year = await Data.findOne({
      where: {
        dataId: res.locals.dataId,
      },
      attributes: [
        'yearFrom',
        'yearTo',
      ],
    }).then(d => d.dataValues)

    res.json({
      data,
      year: {
        yearFrom: year.yearFrom,
        yearTo: year.yearTo,
      },
    })
  }catch(err){
    console.log(new Error(err))
  }
})



export default router