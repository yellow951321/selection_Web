import express from 'express'

import {map, getFromNum, } from 'projectRoot/data/operation/mapping'
import { findYearAll, parseYear, projectDelete, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

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
    let data = await findYearAll({
      typeId: res.locals.typeId,
      campusId: res.locals.campusId,
    })
    let typeName = campusMap[res.locals.typeId].type
    let campusName = campusMap[res.locals.typeId].campus[res.locals.campusId]
    let yearFroms = await parseYear(data)
    res.render('year', {
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


// router.get('/review', (req,res)=>{
// //TODO render the edit without edition permission
// })

// router.get('/edit', (req,res)=>{
//   try {
//     res.redirect(`/mid-long-term/${req.session.userId}/${res.locals.typeId}/${res.locals.campusId}/${res.locals.year}/index`)
//   } catch(err) {
//     console.log(err)
//   }
// })

export default router