/**
 * @file Delete the content with the given `contentId`
 */
import {Content, } from 'mid-long-term/models/association.js'

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
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  if(typeof info.contentId !== 'number' || Number.isNaN(info.contentId)){
    const err = new Error('contentId is NaN')
    err.status = 400
    throw err
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
    err = new Error('deleting data failed')
    err.status = 500
    throw err
  }
  return result
}