import express from 'express'

import {map, getFromNum, } from 'projectRoot/data/operation/mapping'
import { findYearAll, parseYear, projectDelete, } from 'projectRoot/mid-long-term/models/operations/Data.js'
import { TSArrayType, } from 'babel-types'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'


const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/add', async(req, res)=>{

})


router.delete('/delete', async(req, res)=>{
  try{
    const {dataValues, } = await Data.findOne({
      where: {
        campusId: res.locals.campusId,
        typeId: res.locals.typeId,
        yearFrom: res.locals.year, // TODO
        yearTo: res.locals.year, // TODO
        userId: req.session.userId,
      },
      attributes: ['dataId', ],
    })
    if(dataValues != null) {
      // await projectDelete(dataValues.dataId)
      console.log('deletion procedure is conpleted')
      res.send('OK')
    }else
      throw new Error('No specified dataId')
  } catch (err) {
    console.log(err)
  }
})

router.get('/review', async(req, res) => {

})

router.get('/edit', async(req, res) => {
  try {

    let typeName = getFromNum(map, {type: res.locals.typeId, })
    let campusName = getFromNum(map, {
      type: res.locals.typeId,
      campus: res.locals.campusId, })
    res.render('manage/edit', {
      GLOBAL: {
        channel: {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        id: req.session.userId,
        user: res.locals.user,
        type: {
          id: res.locals.typeId,
          name: typeName,
        },
        campus: {
          id: res.locals.campusId,
          name: campusName,
        },
      },
    })
  } catch (err) {
    console.log(err)
  }
})

export default router