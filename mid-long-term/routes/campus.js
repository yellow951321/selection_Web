import express from 'express'

import { findCampusAll, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import {map, getFromNum, getFromWord } from 'projectRoot/data/operation/mapping'
import { insertCampus } from '../models/operations/Data';

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

    let typeName = getFromNum(map, {type: res.locals.typeId})

    res.render('manage/campus',{
      GLOBAL: {
        channel:{
          id: 'mid-long-term',
          name: '中長程計畫'
        },
        id: req.session.userId,
        user: res.locals.user,
        map: map.campus,
        type: {
          id: res.locals.typeId,
          name: typeName
        },
        campuses: campuses
      }
    })

  }catch( err ){
    console.log(err)
  }
})

router.post('/file/add', async (req, res)=>{
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
    res.redirect(`/mid-long-term/${req.session.userId}/0/index`)

  }catch( err ){
    console.log(err)
  }
})

export default router