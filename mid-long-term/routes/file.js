import express from 'express'

import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

import projectDelete from 'mid-long-term/models/operations/project-delete.js'
import projectCreate from 'mid-long-term/models/operations/project-create.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'


const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/add', async(req, res)=>{
  try{
    let campusName = campusMap[req.body.type].campus.indexOf(req.body.campus)
    projectCreate({
      campusId: campusName,
      yearFrom: req.body.yearFrom,
      yearTo: req.body.yearTo,
      typeId: req.body.type,
      userId: req.session.userId,
    })
    res.redirect(`/mid-long-term/${req.body.type}/index`)

  }catch(err){
    console.log(err)
  }
})


router.delete('/delete', async(req, res)=>{
  try{
    const {dataValues, } = await Data.findOne({
      where: {
        dataId: res.locals.dataId,
      },
      attributes: ['dataId', ],
    })
    if(dataValues != null) {
      await projectDelete(dataValues.dataId)
      console.log('deletion procedure is conpleted')
      res.send('OK')
    }else
      throw new Error('No specified dataId')
  } catch (err) {
    console.log(err)
  }
})

router.get('/edit', async(req, res) => {
  try {
    let checkData = await Data.findOne({
      where: {
        dataId: res.locals.dataId,
      },
      attributes: [
        'dataId',
        'userId',
      ],
    })
    if(checkData.dataValues.userId !== req.session.userId){
      res.redirect(`/mid-long-term/${res.locals.typeId}/${res.locals.campusId}/${res.locals.dataId}/review`)
      return
    }

    let typeName = campusMap[res.locals.typeId].type
    let campusName = campusMap[res.locals.typeId].campus[res.locals.campusId]
    res.render('edit', {
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
        },
        {
          name: '編輯'
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      dataId: res.locals.dataId,
      map: campusMap,
      type: {
        id: res.locals.typeId,
        name: typeName
      },
      campus: {
        id: res.locals.campusId,
        name: campusName
      }
    })
  } catch (err) {
    console.log(err)
  }
})

export default router