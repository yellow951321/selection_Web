const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

const User = require('../../models/mariadb/User/schema')
const {getYear, } = require('../../models/mariadb/User/op')

router.get('/', async (req, res)=>{
  try{
    const user = await User.findOne({
        where: {
          user_id:req.session.userId
        }
      })

    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues} = user

    const files = await getYear({
      username : dataValues.user_name,
    })
    //if years is undefined ,year.pug will render a empty files view
    if(files.length === 0)
      res.render('manage/year', {
        GLOBAL : {
          id :req.session.userId,
          user : dataValues.user_name,
        },
      })
    else
      res.render('manage/year', {
        GLOBAL:{
          years : files,
          id: req.session.userId,
          user : dataValues.user_name,
        },
      })
  }
  catch (err){
    res.status(403).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})


module.exports = router