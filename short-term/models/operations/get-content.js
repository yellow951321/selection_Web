import {Content, } from 'short-term/models/association.js'
import labelFromNumber from 'projectRoot/short-term/models/operations/label-from-number.js'

/**
 * @typedef {object} ContentInfo
 * @property {number} campusId
 * @property {string} title1
 * @property {string} title2
 * @property {string} title3
 * @property {string} title4
 * @property {string} content
 * @property {string} summary
 * @property {string} note
 * @property {number} pageFrom
 * @property {number} pageTo
 * @property {number} aspect
 * @property {number} keypoint
 * @property {number} method
 * @property {number} conflictedAspect
 * @property {number} conflictedKeypoint
 * @property {number} conflictedMethod
 * @property {number} isChecked
 * @property {number} isConflicted
 * @property {number} reviewerId
 * @property {number} updateTime
 * @property {number} dataId
 */
/**
 * Return total content with the given informatioin
 * @function GetContent
 * @param {number} aspect - The ID of the Aspect
 * @param {number} keypoint - The ID of the keypoint
 * @param {number} method - The ID of the method
 * @param {number} dataId - The ID of the data in data table
 * @param {number} isChecked - The status of this data
 * @param {number} isConflicted - The another status of this data
 * @returns {ContentInfo}
 * @todo give the link of the illustration of isChecked and isConflicted
 */
export default async(aspect, keypoint, method, dataId, isChecked =-1, isConflicted=-1) => {
  /** if any of the value of the three type of label is -1
     *  ,which means show all the content under this label
     *  ,we need to set special condition
    */

  if(Number.isNaN(Number(dataId)) || typeof dataId !== 'number'){
    const err = new Error('dataId is NaN')
    err.status = 400
    throw err
  }
  dataId = Number(dataId)
  if(Number.isNaN(Number(aspect)) || typeof aspect !== 'number'){
    const err = new Error('aspect is NaN')
    err.status = 400
    throw err
  }
  aspect = Number(aspect)
  if(Number.isNaN(Number(keypoint)) || typeof keypoint !== 'number'){
    const err = new Error('keypoint is NaN')
    err.status = 400
    throw err
  }
  keypoint = Number(keypoint)
  if(Number.isNaN(Number(method)) || typeof method !== 'number'){
    const err = new Error('method is NaN')
    err.status = 400
    throw err
  }
  method = Number(method)
  if(isChecked !== 1 && isChecked !== -1 && isChecked !== 0){
    const err = new Error('isChecked is not a valid option')
    err.status = 400
    throw err
  }
  if(isConflicted !== 1 && isConflicted !== -1 && isConflicted !== 0){
    const err = new Error('isConflicted is not a valid option')
    err.status = 400
    throw err
  }

  let whereCondition = {
    dataId,
  }
  if(aspect !== -1){
    whereCondition['aspect'] = aspect
    if(keypoint !== -1){
      whereCondition['keypoint'] = keypoint
      if(method !== -1){
        whereCondition['method'] = method
      }
    }
  }
  /**
   * Check the isConflicted is -1 or not,
   * if isConflicted is not -1, we need to explicitly
   * set the isConflixted property in the object whereCondition.
   */
  if(isConflicted != -1){
    whereCondition['isConflicted'] = isConflicted
  }
  /**
   * So as the reason written above.
   */
  if(isChecked != -1){
    whereCondition['isChecked'] = isChecked
  }
  let data = await Content.findAll({
    where: whereCondition,
    attributes: [
      'contentId',
      'title1',
      'title2',
      'title3',
      'title4',
      'content',
      'summary',
      'note',
      'pageFrom',
      'pageTo',
      'aspect',
      'keypoint',
      'method',
      'conflictedAspect',
      'conflictedKeypoint',
      'conflictedMethod',
      'isChecked',
      'reviewerId',
      'isConflicted',
      'updateTime',
      'dataId',
    ],
  })

  if(data === null || data.length === 0){
    return 'empty data'
  }
  try{
    data = await Promise.all(data.map(async(obj) => {return await labelFromNumber(obj)}))
  }
  catch(err){
    err = new Error('data formatting failed')
    err.status = 500
    throw err
  }
  return data
}