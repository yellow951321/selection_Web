import express from 'express'

// import getAllYear from 'short-term/models/operations/get-all-year.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
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
    // const data = await getAllYear({
    //   typeId: res.locals.typeId,
    //   campusId: res.locals.campusId
    // })
    res.render('year', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '短程計畫',
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      data: [],
      years: [107, 108],
    })
  }catch(err){
    throw new Error("error occurred in year.js", err)
  }
})


export default router