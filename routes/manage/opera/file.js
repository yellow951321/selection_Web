const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const User = require('../../../models/mariadb/User/schema')
const {Schema} = require('./../../../config')
const { map,getFromWord,getFromNum } = require('../../../data/operation/mapping');
const { findYear, findYearAll, insertYearByUserId } = require('../../../models/mariadb/Year/op')
const { deleteCampus, findCampus, insertCampusByYearId } = require('../../../models/mariadb/Campus/op')


router.post('/add', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id:req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    let year = await insertYearByUserId(user.user_id, req.body.year)
    let type = getFromNum(map,{type: req.body.type})
    let campus = await insertCampusByYearId(year.year_id, getFromWord(map,{
        campus: req.body.campus,
        type: type
    }), req.body.type)

    res.redirect(`/man/${req.session.userId}/${req.body.year}/${type}/${req.body.campus}`)
    console.log('Add operation is finished')

  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.delete('/delete', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id:req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    console.log(req.body.campus_id)
    await deleteCampus(req.body.campus_id)
    res.status(200).send('OK')
  }
  catch (err){
    console.log(err)
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router

