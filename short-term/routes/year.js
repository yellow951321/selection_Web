import express from 'express'

import getAllYear from 'short-term/models/operations/get-all-year.js'
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
    const data = await getAllYear()
    let years = []
    data.forEach(d => {
      years.push(d.year)
    })
    res.render('year', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '計畫申請書',
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      years,
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