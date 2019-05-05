import express from 'express'

import getAllYear from 'mid-long-term/models/operations/get-all-year.js'
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res)=>{
  try{
    const data = await getAllYear({
      typeId: res.locals.typeId,
      campusId: res.locals.campusId
    })
    res.render('year', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        {
          id: res.locals.typeId,
          name: 'type',
        },
        {
          id: res.locals.campusId,
          name: 'campusName'
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      data
    })
  }catch(err){
    console.error(err)
    if(!err.staus){
      err =  new Error("error occurred in year.js", err)
      err.staus = 500
    }
    throw err
  }
})

export default router