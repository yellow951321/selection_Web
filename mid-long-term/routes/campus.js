import express from 'express'

import {map, } from 'projectRoot/data/operation/mapping'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', (req,res)=>{
  res.render('manage/campus',{
    GLOBAL: {
      id: '0',
      user: '0',
      map: map.campus,
      campuses: [{
        id: 0,
        name: '成功大學',
        time: '2019-05-20'
      },{
        id: 1,
        name: '中原大學',
        time: '2019-05-10'
      },{
        id: 2,
        name: '台灣大學',
        time: '2019-05-23'
      }]
    }
  })
})


export default router