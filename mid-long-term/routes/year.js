import express from 'express'

import {map, } from 'projectRoot/data/operation/mapping.js'
import { parseYear, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import getAllYear from 'mid-long-term/models/operations/get-all-year.js'
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
    let data = await getAllYear({
      typeId: res.locals.typeId,
      campusId: res.locals.campusId,
    })
    let typeName = campusMap[res.locals.typeId].type
    let campusName = campusMap[res.locals.typeId].campus[res.locals.campusId]
    let yearFroms = await parseYear(data)
    res.render('manage/year', {
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
        id: req.session.userId,
        user: res.locals.user,
        map: map.campus,
        type: {
          id: res.locals.typeId,
          name: typeName
        },
        campus: {
          id: res.locals.campusId,
          name: campusName
        },
        yearFroms: yearFroms,
    })

  }catch(err){
    console.log(err)
  }
})


export default router