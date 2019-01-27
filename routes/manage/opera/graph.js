const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const pug = require('pug')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const fs = require('fs')
const User = require('../../../models/mariadb/User/schema')

const OP = require('../../../data/operation/draw')
const { map, getFromNum, getFromWord, } = require('../../../data/operation/mapping')
const { findYear, findYearById, } = require('../../../models/mariadb/Year/op')
const { findCampus, findCampusById, } = require('../../../models/mariadb/Campus/op')
const drawBarChart = require('./drawAPI')



router.get('/',async (req,res)=>{
  try{
    const user = await User.findOne({
      where:{
        user_id: req.session.userId
      }
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)
    else
      var {dataValues, } = user
    const result = await OP.countAllDetailRespectToCampusId(res.locals.campus_id)

    const result_word = OP.convertToWord(result)

    const dataSet = OP.convertToJson(result_word,{json: false})

    // console.log(dataSet)
    var fn = pug.compileFile(`views/playground.pug`)
    const type = getFromNum(map,{type: res.locals.type_id})
    var html = fn({
      title: res.locals.campus,
      GLOBAL:{
        id: req.session.userId,
        user: dataValues.user_name,
        year: res.locals.year,
        type: type,
        campus: res.locals.campus
      }
    })
    // console.log('In here')
    const { document } = (new JSDOM(html)).window
    // draw the graph
    // const data = JSON.parse(fs.readFileSync('public/data/test.json'))

    const { year } = (await findYearById(res.locals.year_id)).dataValues

    console.log(res.locals.campus_id)
    const { campus_name } =  (await findCampusById(res.locals.campus_id)).dataValues
    const campus_word = getFromNum(map,{campus: campus_name, type: res.locals.type_id})
    drawBarChart(document.querySelector('body'),dataSet,{
      year: year,
      year_id : res.locals.year_id,
      type: type,
      campus: campus_word,
      id: req.session.userId
    })
    res.send(document.querySelector('html').innerHTML)
  }
  catch(err){
    console.log(err)
  }

})



module.exports = router
