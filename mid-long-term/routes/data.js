import express from 'express'
import dataDelete from 'mid-long-term/models/operations/data-delete.js'
import dataCreate from 'mid-long-term/models/operations/data-create.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import contentAuth from 'projectRoot/mid-long-term/models/operations/content-auth.js'

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
    const result = await dataDelete(req.body.dataId, req.session.userId)
    if(result === 'Unauthorized')
      res.redirect('/auth/unauthor')
    else
      res.redirect('/mid-long-term/index')
  } catch (err) {
    if(!err.status){
      err = new Error('fail to delete data')
      err.status = 500
    }
    next(err)
  }
})

router.use('/:dataId', async(req, res, next) => {
  try{
    let result = await contentAuth({
      dataId: req.params.dataId,
      userId: req.session.userId
    })
    if(result === 'empty data'){
      const err = new Error('data not found')
      err.status = 404
      throw err
    }

    if(result.message === 'as a reviewer'){
      res.redirect(`/mid-long-term/review/${dataId}/index`)
      return
    }

    res.locals.year = result.info.year
    res.locals.typeId = result.info.typeId
    res.locals.campusId = result.info.campusId
    next()
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('invalid argument')
      err.status = 400
    }
    next(err)
  }
})

router.get('/:dataId/edit', async(req, res, next) => {
  try {
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
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      dataId: req.params.dataId,
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
    if(!err.status){
      const err = new Error('entry edit page failed')
      err.status = 500
    }
    next(err)
  }
})

export default router
