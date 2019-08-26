import {Content, } from 'mid-long-term/models/association.js'
import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'

/**
 * @typedef ContentInfo
 * @property {string} updateTime
 * @property {string} title1
 * @property {string} title2
 * @property {string} title3
 * @property {string} title4
 * @property {string} content
 * @property {string} summary
 * @property {string} note
 * @property {number} isChecked
 * @property {number} isConflicted
 * @property {number} contentId
 * @property {number} pageFrom
 * @property {number} pageTo
 * @property {number} aspect
 * @property {number} keypoint
 * @property {number} method
 * @property {number} conflictedAspect
 * @property {number} conflictedKeypoint
 * @property {number} conflictedMethod
 * @property {number} reviewerId
 */

/**
 * Return all the content given the specific condition
 * @function getContent
 * @param {number} aspect
 * @param {number} keypoint
 * @param {number} method
 * @param {number} dataId
 * @param {number} isChecked
 * @param {number} isConflicted
 * @returns {ContentInfo[]}
 * @throws - throw a
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

  if(isConflicted != -1){
    whereCondition['isConflicted'] = isConflicted
  }

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