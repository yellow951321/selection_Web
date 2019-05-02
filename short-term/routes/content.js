import express from 'express'

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/index', async(req, res) => {
  try{
    res.render('manage/edit', {})
  }catch (err) {
    console.log(err)
  }
})

router.get('/filter', async(req, res)=>{

})

router.post('/add', async(req, res)=>{

})

router.post('/save', async(req, res)=>{

})


router.delete('/delete', async(req, res)=>{

})

export default router