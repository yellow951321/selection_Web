const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

router.get('/',(req,res)=>{
  try{
    res.render('manage/edit')
  }
  catch (err){
    res.status(403).send(`
    <h2>403 Forbidden </h2>
    <p>No session Id or your sessionId is expired</p>
    <p>Please redirect to the log page</p>
    <a href="http://localhost:3000/auth/login">Click Here</a>
    `)
  }
})



module.exports = router