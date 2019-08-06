import express from 'express'
import getAllCampus from 'short-term/models/operations/get-all-campus.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res, next)=>{
  try{
    const typeName = campusMap[res.locals.typeId].type
    const data = await getAllCampus({
      typeId: res.locals.typeId,
      year: res.locals.yearId,
    })
    res.render('campus', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '計畫申請書',
        },
        {
          id: res.locals.yearId,
          name: res.locals.yearId,
        },
        {
          id: res.locals.typeId,
          name: typeName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      year: res.locals.yearId,
      type: {
        id: res.locals.typeId,
        name: typeName
      },
      data,
    })
  }catch(err){
    if(!err.status){
      err = new Error('Error occurred in short-term/routes/campus.js')
      err.status = 500
    }
    next(err)
  }
})


export default router