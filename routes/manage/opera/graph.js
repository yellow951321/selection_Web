const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const OP = require('../../../data/operation/draw')
const { map, getFromNum, getFromWord, } = require('../../../data/operation/mapping')
const drawBarChart = require('./drawAPI')
const pug = require('pug')
const jsdom = require('jsdom')
const fs = require('fs')
const User = require('../../../models/mariadb/User/schema')
const { JSDOM } = jsdom


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

    console.log(dataSet)
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

    const { window } = (new JSDOM(html))
    // draw the graph
    // const data = JSON.parse(fs.readFileSync('public/data/test.json'))

    drawBarChart(window.document.querySelector('body'),dataSet,{
      year: res.locals.year,
      type: type,
      campus: res.locals.campus,
      id: req.session.userId,
      window: window
    })
    res.send(document.querySelector('html').innerHTML)
  }
  catch(err){

  }

})

module.exports = router
