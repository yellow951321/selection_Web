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
          name: '計畫申請書',
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
    if(!err.status){
      err = new Error('Error occurred in short-term/routes/type.js')
      err.status = 500
    }
    next(err)
  }
})

export default router