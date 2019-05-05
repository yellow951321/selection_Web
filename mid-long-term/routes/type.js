import express from 'express'

import getAllType from 'mid-long-term/models/operations/get-all-type.js'

const router = express.Router()

router.get('/index', async(req, res, next)=>{
  try{
    let types = await getAllType()
    res.render('type', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      types: types,
    })
  }catch(err) {
    if(!err.status){
      err = new Error('Error occurred in mid-long-term/routes/type.js', err)
      err.status = 500
    }
    next(err)
  }
})

export default router