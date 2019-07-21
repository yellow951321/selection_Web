
/**
 * @namespace shortTermRoute
 */

// /**
//  * @file
//  * @module app/campus
//  * @requires express
//  * @requires 'short-term/models/operations/get-all-campus.js'
//  * @requires lib/static/javascripts/mapping/campus.js'
//  */
//import express module
import express from 'express'
// import function in get-all-campus.js named getAllCampus
import getAllCampus from 'short-term/models/operations/get-all-campus.js'
// import function in campus.js named campusMap
import campusMap from 'lib/static/javascripts/mapping/campus.js'

/**
 * Express route class
 * @name campus/Router
 * @function router
 * @param {object} [options] - The custimized setting of Router()
 * @inner
 * @see https://expressjs.com/
 */
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

/**
 * set A '/index' route, method GET
 * @name get/index
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @thorws - Throws an error if any error occurred in here
 */
router.get('/index', async(req, res, next)=>{
  try{
    /**
     * The request to this route is to respond with all campus data
     */
    /**
     * Convert the {string} typeName with campusMap
     */
    const typeName = campusMap[res.locals.typeId].type
    /**
     * execute the getAllCampus() to find all campus data
     * with the given typeIda and yearId
     */
    const data = await getAllCampus({
      typeId: res.locals.typeId,
      yearId: res.locals.yearId,
    })
    /**
     * After obtain the whole campus data,
     * render back with campus.pug page
     */
    res.render('campus', {
      breadcrumb: [
        {
          id: 'short-term',
          name: '計畫申請書',
        },
        {
          id: res.locals.yearId,
          name: res.locals.yearId,
        },
        {
          id: res.locals.typeId,
          name: typeName
        }
      ],
      id: req.session.userId,
      user: res.locals.user,
      year: res.locals.yearId,
      type: {
        id: res.locals.typeId,
        name: typeName
      },
      data,
    })
  }catch(err){
    // Error handling
    if(!err.status){
      err = new Error('Error occurred in short-term/routes/campus.js')
      err.status = 500
    }
    next(err)
  }
})


export default router