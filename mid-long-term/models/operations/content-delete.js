/**
 * @file Delete the content with the given `contentId`
 */
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'

/**
 * @typedef infoObject info
 * @property {number} contentId
 */

/**
 * Delete the content with the given `contentId`
 * @function content-delete
 * @param {infoObject} info
 * @returns {object}
 * @throws invalid argument
 * @throws contentId is not a number
 * @throws content delete failed
 */
export default async(info)=>{
  try{
    /**
     * Validate the info is object or not.
     */
    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    /**
     * Explicitly convert the
     * `info.contentId`,
     * to type `number`
     */
    info.contentId = Number(info.contentId)
    /**
     * Validate the `info.contentId` is `NaN` or not.
     */
    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
    }
    try{
      /**
       * Destroy the content with the given `contentId`
       */
      return Content.destroy({
        where:{
          contentId: info.contentId,
        },
      })
    }
    catch(err){
      /**
       * Catch the exception, `Content.destroy`
       */
      err = new Error('content delete failed')
      err.status = 500
    }
  }
  catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(Number.isNaN(err.status)){
      err = new Error('content-delete.js failed')
      err.status = 500
    }
    throw err
  }
}