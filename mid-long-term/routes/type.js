import express from 'express'

import {map, } from 'projectRoot/data/operation/mapping'

const router = express.Router()

router.get('/index', (req,res)=>{
  res.render('manage/type',{
    GLOBAL:{
      years: '',
      id: '0',
      user: '0',
      map: map.campus,
      types: ['普通大學', '技專院校'],
    }
  })
})

export default router