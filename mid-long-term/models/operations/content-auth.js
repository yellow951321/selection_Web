/**
 * @file Used for Checking the `info.userId` wether is owned `info.dataId` or not.
 */
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

/**
 * @typedef infoObject
 * @property {string | number} userId,
 * @property {string | number} dataId
 */

/**
 * Used for Checking the `info.userId` wether is owned `info.dataId` or not.
 * @function content-auth
 * @param {infoObject} info
 * @returns {string}
 * @throws `dataId` is `NaN`
 * @throws `userId` is `NaN`
 * @throws data fetch failed
 */
export default async(info) => {
  try{
    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.dataId = Number(info.dataId)
    info.userId = Number(info.userId)

    if(Number.isNaN(info.dataId)){
      let err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.userId)){
      let err = new Error('userId is NaN')
      err.status = 400
      throw err
    }

    let checkData
    try{
      checkData = await Data.findOne({
        where:{
          dataId: info.dataId,
        },
        attributes: [
          'typeId',
          'campusId',
          'userId',
        ],
      })
    }catch(err){
      /**
       * Catch the exception occurred in executing `Data.findOne`
       */
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }

    if(checkData === null){
      return 'empty data'
    }
    let result = {
      info:{
        typeId: checkData.typeId,
        campusId: checkData.campusId,
      },
    }
    if(checkData.userId !== info.userId){
      result.message = 'as a reviewer'
    }
    else{
      result.message = 'as an editor'
    }

    return result
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err = new Error('content-auth failed')
      err.status = 500
    }
    throw err
  }
}