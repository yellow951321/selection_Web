import express from 'express'

import {
  countCampusAll,
  countCampusRespectToAspect,
  countCampusRespectToKey,
  countCampusRespectToMethod, } from 'projectRoot/mid-long-term/models/operations/draw.js'

import {map, getFromWord, getFromNum, } from 'projectRoot/data/operation/mapping.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

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
    let typeName = cmapusMap[res.locals.typeId].type
    let campusName = campusMap[res.locals.typeId].cmapus[res.locals.campusId]
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
        },
        {
          name: '圖表'
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
    if(!err.status){
      err = new Error("Error occurred in mid-long-term/routes/graph.js", err)
      err.status = 500
      next(err)
    }
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
    if(!err.status){
      err = new Error("Error occurred in mid-long-term/routes/graph.js filter router")
      err.status = 500
      next(err)
    }
  }
})



export default router