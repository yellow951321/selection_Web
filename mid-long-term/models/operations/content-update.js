/**
 * @file update the content fo the `content` by the given `contetId`
 */

import {Content, } from 'mid-long-term/models/association.js'
/**
 * @typedef infoObject info
 * @property {number} contentId
 * @property {number} userId
 * @property {number} pageFrom
 * @property {nummber} pageTo
 * @property {string} title1
 * @property {string} title2
 * @property {string} title3
 * @property {string} title4
 * @property {string} content
 * @property {string} summary
 * @property {string} note
 * @property {number} reviewerId
 */

/**
 * update a content with the given `userId`, `contentId`.
 * @function content-update
 * @param {number} contentId
 * @param {infoObject} updateData
 * @returns {object}
 * @throws invalide argument
 * @throws `contentId`is `NaN`
 * @throws `pageFrom` is `NaN`
 * @throws `pageTo` is `NaN`
 * @throws data fetch failed
 */
export default async(contentId, updatedData) => {
  if(typeof updatedData !== 'object'|| updatedData === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  if(Number.isNaN(Number(contentId)) || typeof contentId !== 'number'){
    const err = new Error('contentId is NaN')
    err.status = 400
    throw err
  }
  contentId = Number(contentId)
  if(updatedData.reviewerId !== undefined){
    if(Number.isNaN(Number(updatedData.reviewerId)) || typeof updatedData.reviewerId !== 'number'){
      const err = new Error('reviewerId is NaN')
      err.status = 400
      throw err
    }
    updatedData.reviewerId = Number(updatedData.reviewerId)
  }
  if(updatedData.conflictedAspect !== undefined){
    if(Number.isNaN(Number(updatedData.conflictedAspect)) || typeof updatedData.conflictedAspect !== 'number'){
      const err = new Error('conflictedAspect is NaN')
      err.status = 400
      throw err
    }
    updatedData.conflictedAspect = Number(updatedData.conflictedAspect)
  }
  if(updatedData.conflictedKeypoint !== undefined){
    if(Number.isNaN(Number(updatedData.conflictedKeypoint)) || typeof updatedData.conflictedKeypoint !== 'number'){
      const err = new Error('conflictedKeypoint is NaN')
      err.status = 400
      throw err
    }
    updatedData.conflictedKeypoint = Number(updatedData.conflictedKeypoint)
  }
  if(updatedData.conflictedMethod !== undefined){
    if(Number.isNaN(Number(updatedData.conflictedMethod)) || typeof updatedData.conflictedMethod !== 'number'){
      const err = new Error('conflictedMethod is NaN')
      err.status = 400
      throw err
    }
    updatedData.conflictedMethod = Number(updatedData.conflictedMethod)
  }
  if(updatedData.isConflicted !== undefined){
    if(!(updatedData.isConflicted === 1 || updatedData.isConflicted === -1 || updatedData.isConflicted === 0)){
      let err = new Error('isConflicted is not a valid argument')
      err.status = 400
      throw err
    }
    updatedData.isConflicted = Number(updatedData.isConflicted)
  }
  if(updatedData.isChecked !== undefined){
    if(typeof updatedData.isChecked !== 'number' || !(updatedData.isChecked === 1 || updatedData.isChecked === -1 || updatedData.isChecked === 0)){
      let err = new Error('isChecked is not a valid argument')
      err.status = 400
      throw err
    }
    updatedData.isChecked = Number(updatedData.isChecked)
  }

  let data, newData
  try{
    data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
        'isChecked',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  try{
    newData = await data.update(updatedData)
  }catch(err){
    err = new Error('updating data failed')
    err.status = 500
    throw err
  }
  return newData
}