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

router.get('/index', async(req, res)=>{
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
          name: '短程計畫',
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      years,
    })
  }catch(err){
    throw new Error("error occurred in year.js", err)
  }
})


export default router