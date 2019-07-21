import express from 'express'

import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

import dataDelete from 'mid-long-term/models/operations/data-delete.js'
import dataCreate from 'mid-long-term/models/operations/data-create.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

import {findOne, findAll} from 'projectRoot/lib/db-op/find.js'

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
      yearFrom: req.body.yearFrom,
      yearTo: req.body.yearTo,
      typeId: req.body.type,
      userId: req.session.userId,
    })
    res.redirect(`/mid-long-term/${req.body.type}/index`)

  }catch(err){
    if(err.status)
      next(err)
    else {
      err = new Error('Failed to POST at route `/mid-long-term/data/add`.')
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

    const data = await findOne({
      interface      : Data,
      whereCondition : {
                          dataId,
                       },
      attributes     : ['dataId', ],
      allowNull : false
    })

    await dataDelete(data.dataId, req.session.userId)
    res.redirect('/mid-long-term/index')

    // const data = await Data.findOne({
    //   where: {
    //     dataId,
    //   },
    //   attributes: ['dataId', ],
    // })
    // if(data != null) {
    //   await dataDelete(data.dataId, req.session.userId)
    //   res.redirect('/mid-long-term/index')
    // }else{
    //   const err = new Error('No specified dataId')
    //   err.status = 400
    //   throw err
    // }
  } catch (err) {
    if(err.status){
      next(err)
    }
    else{
      if(!err.status){
        err = new Error('fail to delete data')
        err.status = 500
      }else if(err.status == 404){
        err = new Error('No specified dataId')
        err.status = 400
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

    let data = await findOne({
      interface: Data,
      whereCondition: {
        dataId,
      },
      attributes : [
        'dataId',
        'userId',
        'campusId',
        'typeId',
      ],
      allowNull : false
    })

    // let data = await Data.findOne({
    //   where: {
    //     dataId,
    //   },
    //   attributes: [
    //     'dataId',
    //     'userId',
    //     'campusId',
    //     'typeId',
    //   ],
    // })

    // if(data === null){
    //   const err = new Error('data not found')
    //   err.status = 404
    //   throw err
    // }

    if(data.userId !== req.session.userId){
      res.redirect(`/mid-long-term/review/${dataId}/index`)
      return
    }

    let typeName = campusMap[data.typeId].type
    let campusName = campusMap[data.typeId].campus[data.campusId]
    res.render('edit', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
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
