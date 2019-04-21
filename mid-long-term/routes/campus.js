import express from 'express'

import { findCampusAll, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import {map, getFromNum } from 'projectRoot/data/operation/mapping'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async (req,res)=>{
  try{

    let campuses = await findCampusAll(req.session.userId, res.locals.typeId)
    campuses = campuses.map( data => {
      return {
        id: data,
        name: getFromNum(map, {
          type: res.locals.typeId,
          campus: data
        }),
        time: '2019-05-20'
      }
    })

    res.render('manage/campus',{
      GLOBAL: {
        id: req.session.userId,
        user: res.locals.user,
        map: map.campus,
        type: res.locals.typeId,
        campuses: campuses
      }
    })

  }catch( err ){
    console.log(err)
  }
})



export default router