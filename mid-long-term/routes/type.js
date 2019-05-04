import express from 'express'

import getAllType from 'mid-long-term/models/operations/get-all-type.js'
import typeMap from 'lib/static/javascripts/mapping/campus.js'



const router = express.Router()

router.get('/index', async(req, res)=>{
  try{
    let types = await getAllType(req.session.userId)

    types = await types.map((typeId) => {
      return {
        name: typeMap[typeId].type,
        id: typeId,
      }
    })

    res.render('type', {
      breadcrumb: [
        {
          id: 'mid-long-term',
          name: '中長程計畫',
        },
      ],
      id: req.session.userId,
      user: res.locals.user,
      map: typeMap,
      types: types,
    })
  }catch(err) {
    console.log(err)
  }
})

export default router