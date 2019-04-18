import express from 'express'

import {map, } from 'projectRoot/data/operation/mapping'

const router = express.Router()

router.get('/index', (req,res)=>{
  res.render('manage/channel',{
    GLOBAL:{
      years: '',
      id: '',
      user: '0',
      map: map.campus
    }
  })
})

export default router