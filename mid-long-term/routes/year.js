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
    const {typeName, campusName, yearFroms} = await getAllYear({
      typeId: res.locals.typeId,
      campusId: res.locals.campusId,
    })
    res.render('year', {
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
        type: {
          id: res.locals.typeId,
          name: typeName
        },
        campus: {
          id: res.locals.campusId,
          name: campusName
        },
        yearFroms: yearFroms
    })

  }catch(err){
    if(!err.staus){
      err =  new Error("Error occurred in mid-long-term/routes/year.js")
      err.stauts = 500
    }
    next(err)
  }
})


export default router