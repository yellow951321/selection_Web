/**
 * @file Used for updating the label, `isChecked`, `isConflicted`, `conflictedLabel`
 */
import Content from 'projectRoot/short-term/models/schemas/Content.js'

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
  try{

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    let data, savedData

    info.contentId = Number(info.contentId)
    info.aspect = Number(info.aspect)
    info.keypoint = Number(info.keypoint)
    info.method = Number(info.method)

    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is NaN')
      err.status = 400
      throw err
    }

    if(Number.isNaN(info.aspect)){
      let err = new Error('aspect is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.keypoint)){
      let err = new Error('keypoint is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.method)){
      let err = new Error('method is NaN')
      err.status = 400
      throw err
    }
    try{
      data = await Content.findOne({
        where:{
          contentId: info.contentId,
        },
        attributes:[
          'contentId',
          'isConflicted',
        ],
      })

      // check if the change label request is from the conflicted status or edit status
      // if it's change status to checked
      let isChecked = 0
      if(data.isConflicted === 1)
        isChecked = 1

      savedData = await data.update({
        isChecked,
        isConflicted: 0,
        aspect: info.aspect,
        keypoint: info.keypoint,
        method: info.method,
        conflictedAspect: null,
        conflictedKeypoint: null,
        conflictedMethod: null,
      })
    }
    catch(err){
      if(typeof err.status !== 'number')
        err= new Error('data update failed')
      err.status = 500
      throw err
    }
    return savedData
  }
  catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number')
      err= new Error('content-change-label failed')
    err.status = 500
    throw err
  }
}