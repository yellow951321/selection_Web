import express from 'express'

import Data from 'projectRoot/short-term/models/schemas/Data.js'

import dataDelete from 'short-term/models/operations/data-delete.js'
import dataCreate from 'short-term/models/operations/data-create.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'


const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/add', async(req, res, next)=>{
  try{
    await dataCreate({
      campusId: req.body.campus,
      year: req.body.year,
      typeId: req.body.type,
      userId: req.session.userId,
    })
    res.redirect(`/short-term/${req.body.year}/${req.body.type}/index`)

  }catch(err){
    if(err.status)
      next(err)
    else {
      err = new Error('Failed to POST at route `/short-term/data/add`.')
      err.status = 500
      next(err)
    }
  }
})


router.post('/delete', async(req, res, next)=>{
  try{
    const dataId = Number(req.body.dataId);
    if(Number.isNaN(dataId)){
      const err = new Error('invalid argument while deleting data')
      err.status = 400
      throw err
    }

    const data = await Data.findOne({
      where: {
        dataId,
      },
      attributes: ['dataId', ],
    })
    if(data != null) {
      await dataDelete(data.dataId, req.session.userId)
      res.redirect('/short-term/index')
    }else{
      const err = new Error('No specified dataId')
      err.status = 400
      throw err
    }
  } catch (err) {
    if(err.status){
      next(err)
    }
    else{
      if(!err.status){
        err = new Error('fail to delete data')
        err.status = 500
      }
      next(err)
    }
  }
})

router.get('/:dataId/edit', async(req, res, next) => {
  try {
    const dataId = Number(req.params.dataId);
    if(Number.isNaN(dataId)){
      const err = new Error('invalid argument while entrying edit page')
      err.status = 400
      throw err
    }

    let data = await Data.findOne({
      where: {
        dataId,
      },
      attributes: [
        'dataId',
        'userId',
        'campusId',
        'typeId',
        'year',
      ],
    })

    if(data === null){
      const err = new Error('data not found')
      err.status = 404
      throw err
    }

    if(data.userId !== req.session.userId){
      res.redirect(`/short-term/review/${dataId}/index`)
      return
    }

    let typeName = campusMap[data.typeId].type
    let campusName = campusMap[data.typeId].campus[data.campusId]
    res.render('edit', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '計畫申請書',
        },
        {
          id: data.year,
          name: data.year,
        },
        {
          id: data.typeId,
          name: typeName
        },
        {
          id: data.campusId,
          name: campusName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      dataId: data.dataId,
      map: campusMap,
      type: {
        id: data.typeId,
        name: typeName
      },
      campus: {
        id: data.campusId,
        name: campusName
      }
    })
  } catch (err) {
    if(!err.status){
      const err = new Error('entry edit page failed')
      err.status = 500
    }
    next(err)
  }
})

export default router