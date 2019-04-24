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
  res.render('manage/year',{
    GLOBAL:{
      id: '0',
      user: '0',
      map: map.campus,
      type: '普通大學',
      campusId: '20',
      yearFroms: [
        {
          year: '104',
          info: [
            {
              year: '107',
              progression: `${20}%`,
              unsolved: 'yes',
              time: '2019-05-20'
            },
            {
              year: '106',
              progression: `${20}%`,
              unsolved: 'yes',
              time: '2019-05-23'
            }
          ]
        },
        {
          year: '105',
          info: [
            {
              year: '107',
              progression: `${20}%`,
              unsolved: 'yes',
              time: '2019-05-20'
            },
            {
              year: '106',
              progression: `${20}%`,
              unsolved: 'yes',
              time: '2019-05-23'
            }
          ]
        }
      ]
    }
  })
})


router.get('/review', (req,res)=>{

})

router.get('/edit', (req,res)=>{
  res.render('manage/edit', {
    GLOBAL: {
      id: '0',
      user: '0',
      map: map.campus,
      type: '普通大學',
      campusId: '20',
    }
  })
})

router.delete('/delete', (req,res)=>{

})


router.get('/download', (req,res)=>{

})


router.get('/graph', (req,res)=>{

})


export default router