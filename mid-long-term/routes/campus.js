
import express from 'express'
import getAllCampus from 'mid-long-term/models/operations/get-all-campus.js'


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
    let {campuses, typeName} = await getAllCampus({
      typeId: res.locals.typeId,
    })

    res.render('campus', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
        {
          id: res.locals.typeId,
          name: typeName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      type: {
        id: res.locals.typeId,
        name: typeName
      },
      campuses: campuses
    })

  }catch(err){
    if(!err.status){
      err = new Error('Error occurred in mid-long-term/routes/campus.js')
      err.status = 500
    }
    next(err)
  }
})


export default router