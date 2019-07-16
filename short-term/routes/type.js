import express from 'express'

import getAllType from 'short-term/models/operations/get-all-type.js'

const router = express.Router()

router.get('/index', async(req, res, next)=>{
  try{
    let types = await getAllType()
    res.render('type', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '短程計畫',
        },
        {
          id: res.locals.yearId,
          name: res.locals.yearId,
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      types: types,
      year: res.locals.yearId,
    })
  }catch(err) {
    next(err)
  }
})

export default router