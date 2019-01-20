const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const OP = require('../../models/User/op')

router.get('/',async (req,res)=>{
  try{

    const doc = await OP.findUsernameAsync(User,req.session.userId)
    res.render('manage/edit',{
      GLOBAL : {
        id : req.session.userId,
        user : doc.username,
        year : res.locals.year,
        type : res.locals.type,
        campus : res.locals.campus
      }
    })
  }
  catch (err){
    res.status(403).render('error',{
      message : err,
      error: {
        status: err.status
      }
    })
  }
})



module.exports = router