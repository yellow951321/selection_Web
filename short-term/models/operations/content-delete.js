/**
 * @file Delete the content with the given `contentId`
 */
import Content from 'projectRoot/short-term/models/schemas/Content.js'

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

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.contentId = Number(info.contentId)

    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
    }
    let result
    try{
      result = await Content.destroy({
        where:{
          contentId: info.contentId,
        },
      })
    }
    catch(err){
      err = new Error('content delete failed')
      err.status = 500
    }
    return result
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('content-delete.js failed')
      err.status = 500
    }
    throw err
  }
}