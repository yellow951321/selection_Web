import express from 'express'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', (req,res)=>{
  res.render('year')
})


router.get('/review', (req,res)=>{

})

router.get('/edit', (req,res)=>{

})

router.delete('/delete', (req,res)=>{

})


router.get('/download', (req,res)=>{

})


router.get('/graph', (req,res)=>{

})


export default router