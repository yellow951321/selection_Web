/**
 * @file update the content fo the `content` by the given `contetId`
 */
import Content from 'projectRoot/short-term/models/schemas/Content.js'
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
  try{
    if(typeof updatedData !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    contentId = Number(contentId)
    if(Number.isNaN(contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
      throw err
    }
    if(updatedData.reviewerId !== undefined){
      updatedData.reviewerId = Number(updatedData.reviewerId)
      if(Number.isNaN(updatedData.reviewerId)){
        let err = new Error('reviewerId is not a number')
        err.status = 400
        throw err
      }
    }
    if(updatedData.conflictedAspect !== undefined){
      updatedData.conflictedAspect = Number(updatedData.conflictedAspect)
      if(Number.isNaN(updatedData.conflictedAspect)){
        let err = new Error('conflictedAspect is not a number')
        err.status = 400
        throw err
      }
    } 
    if(updatedData.conflictedKeypoint !== undefined){
      updatedData.conflictedKeypoint = Number(updatedData.conflictedKeypoint)
      if(Number.isNaN(updatedData.conflictedKeypoint)){
        let err = new Error('conflictedKeypoint is not a number')
        err.status = 400
        throw err
      }
    }
    if(updatedData.conflictedMethod !== undefined){
      updatedData.conflictedMethod = Number(updatedData.conflictedMethod)
      if(Number.isNaN(updatedData.conflictedMethod)){
        let err = new Error('conflictedMethod is not a number')
        err.status = 400
        throw err
      }
    }
    if(updatedData.isConflicted !== undefined){
      updatedData.isConflicted = Number(updatedData.isConflicted)
      if(Number.isNaN(updatedData.isConflicted) || !(updatedData.isConflicted === 1 || updatedData.isConflicted === -1 || updatedData.isConflicted === 0)){
        let err = new Error('isConflicted is not a valid argument')
        err.status = 400
        throw err
      }
    }
    if(updatedData.isChecked !== undefined){
      updatedData.isChecked = Number(updatedData.isChecked)
      if(Number.isNaN(updatedData.isChecked) || !(updatedData.isChecked === 1 || updatedData.isChecked === -1 || updatedData.isChecked === 0)){
        let err = new Error('isChecked is not a valid argument')
        err.status = 400
        throw err
      }
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
      newData = await data.update(updatedData)
    }catch(err){
      err = new Error('update data failed')
      err.status = 500
      throw err
    }
    return newData
  }
  catch(err){
    if(!err.status){
      err = new Error('content-update failed')
      err.status = 500
      throw err
    }
    throw err
  }
}