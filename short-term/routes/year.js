import express from 'express'

import getAllYear from 'mid-long-term/models/operations/get-all-year.js'
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
    res.send('123')
  }catch(err){
    throw new Error("error occurred in year.js", err)
  }
})


export default router