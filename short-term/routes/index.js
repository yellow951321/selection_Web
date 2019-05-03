import express from 'express'

const router = express.Router()

router.get('/index', (req, res)=>{
  res.render('type')
})

export default router