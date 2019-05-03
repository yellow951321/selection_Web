import express from 'express'

import { findTypeAll, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import {map, getFromNum, } from 'projectRoot/data/operation/mapping'

const router = express.Router()

router.get('/index', async(req, res)=>{
  try{
    let types = await findTypeAll(req.session.userId)

    types = await types.map((typeNum) => {
      return {
        name: getFromNum(map, {type: typeNum, }),
        id: typeNum,
      }
    })

    res.render('manage/type', {
      GLOBAL:{
        channel: {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        id: req.session.userId,
        user: res.locals.user,
        map: map.campus,
        types: types,
      },
    })
  }catch(err) {
    console.log(err)
  }
})

export default router