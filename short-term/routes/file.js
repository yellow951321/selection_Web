import express from 'express'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.post('/add', async(req,res)=>{

})


router.delete('/delete', async(req,res)=>{

})

export default router