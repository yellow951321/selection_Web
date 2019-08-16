/**
 * @file Used for updating the label, `isChecked`, `isConflicted`, `conflictedLabel`
 */
import {Content, } from 'mid-long-term/models/association.js'

/**
 * @typedef infoObject info
 * @property {number} contentId
 * @property {number} aspect
 * @property {number} keypoint
 * @property {nummber} method
 */

/**
 * Used for updating the label, `isChecked`, `isConflicted`, `conflictedLabel`
 * @function content-change-label
 * @param {infoObject} info
 * @returns {array}
 * @throws invalide argument
 * @throws `contentId`is `NaN`
 * @throws `aspect` is `NaN`
 * @throws `keypoint` is `NaN`
 * @throws `method` is `NaN`
 * @throws data update failed
 */
export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let data, savedData

  let contentId, aspect, keypoint, method, isChecked
  if(Number.isNaN(info.contentId) || typeof info.contentId !== 'number'){
    const err = new Error('contentId is NaN')
    err.status = 400
    throw err
  }
  contentId = Number(info.contentId)
  if(Number.isNaN(info.aspect) || typeof info.aspect !== 'number'){
    const err = new Error('aspect is NaN')
    err.status = 400
    throw err
  }
  aspect = Number(info.aspect)
  if(Number.isNaN(info.keypoint) || typeof info.keypoint !== 'number'){
    const err = new Error('keypoint is NaN')
    err.status = 400
    throw err
  }
  keypoint = Number(info.keypoint)
  if(Number.isNaN(info.method) || typeof info.method !== 'number'){
    const err = new Error('method is NaN')
    err.status = 400
    throw err
  }
  method = Number(info.method)

  try{
    data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
        'isConflicted',
      ],
    })

    // check if the change label request is from the conflicted status or edit status
    // if it's change status to checked
    isChecked = 0
    if(data.isConflicted === 1)
      isChecked = 1

  }catch(err){
    if(typeof err.status !== 'number'){
      err= new Error('fetching data failed')
      err.status = 500
    }
    throw err
  }
  try{
    savedData = await data.update({
      isChecked,
      isConflicted: 0,
      aspect,
      keypoint,
      method,
      conflictedAspect: null,
      conflictedKeypoint: null,
      conflictedMethod: null,
    })
  }
  catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err= new Error('updating data failed')
      err.status = 500
    }
    throw err
  }
  return savedData
}