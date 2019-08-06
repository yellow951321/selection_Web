/**
 * @file Used for creating new content
 */
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'

/**
 * @typedef infoObject
 * @property {number} dataId
 * @property {number} aspect
 * @property {number} keypoint
 * @property {number} method
 */

/**
 * Used for creating new content
 * @function content-create
 * @param {infoObject} info
 * @returns {object}
 * @throws invalid argument
 * @throws `dataId` is `NaN`
 * @throws `aspect` is `NaN`
 * @throws `keypoint` is `NaN`
 * @throws `method` is `NaN`
 */
export default async(info) => {

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
     * `info.dataId`,
     * `info.aspect`,
     * `info.keypoint`,
     * `info.method`
     * to type `number`
     */
    info.dataId = Number(info.dataId)
    info.aspect = Number(info.aspect)
    info.keypoint = Number(info.keypoint)
    info.method = Number(info.method)
    /**
     * Validate the `info.dataId` is `NaN` or not.
     */
    if(Number.isNaN(info.dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate the `info.aspect` is `NaN` or not.
     */
    if(Number.isNaN(info.aspect)){
      const err = new Error('aspect is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate the `info.keypoint` is `NaN` or not.
     */
    if(Number.isNaN(info.keypoint)){
      const err = new Error('keypoint is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate the `info.method` is `NaN` or not.
     */
    if(Number.isNaN(info.method)){
      const err = new Error('method is NaN')
      err.status = 400
      throw err
    }
    let data
    try{
      data= await Content.create({
        dataId: info.dataId,
        title1: null,
        title2: null,
        title3: null,
        title4: null,
        content: null,
        pageFrom: 1,
        pageTo: 1,
        aspect: info.aspect,
        keypoint: info.keypoint,
        method: info.method,
        isChecked: 0,
        reviewerId: 0,
        isConflicted: 0,
        updateTime: Date.now(),
      })
    }
    catch(err){
      err = new Error('data create failed')
      err.status = 500
      throw err
    }
    return labelFromNumber(data)
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      err = new Error('content-create failed')
      err.status = 500
    }
    throw err
  }
}