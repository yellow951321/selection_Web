import express from 'express'

import { findLastModifiedTimeOfCampus, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import {map, getFromWord, } from 'projectRoot/data/operation/mapping'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

import getAllCampus from 'mid-long-term/models/operations/get-all-campus.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res)=>{
  try{
    let campuses = await getAllCampus(res.locals.typeId)
    let typeName = campusMap[res.locals.typeId].type

    res.render('manage/campus', {
        breadcrumb: [
          {
            id: 'mid-long-term',
            name: '中長程計畫',
          },
          {
            id: res.locals.typeId,
            name: typeName
          }
        ],
        id: req.session.userId,
        user: res.locals.user,
        map: map.campus,
        type: {
          id: res.locals.typeId,
          name: typeName
        },
        campuses: campuses,
    })

  }catch(err){
    console.log(err)
  }
})

router.post('/file/add', async(req, res)=>{
  try{
    let temptype
    (req.body.type == 0)?temptype = '大學':temptype = '技專院校'
    let tempCampus = getFromWord(map, {
      type: temptype,
      campus: req.body.campus,
    })
    insertCampus({
      campusId: tempCampus,
      year: req.body.year,
      type: req.body.type,
      userId: req.session.userId,
    })
    res.redirect(`/mid-long-term/${res.locals.typeId}/index`)

  }catch(err){
    console.log(err)
  }
})

export default router