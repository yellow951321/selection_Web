/**
 * @file Used for Checking the `info.userId` wether is owned `info.dataId` or not.
 */
import {Data, } from 'short-term/models/association.js'

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
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let dataId, userId
  if(Number.isNaN(info.dataId) || typeof info.dataId !== 'number'){
    const err = new Error('dataId is NaN')
    err.status = 400
    throw err
  }
  dataId = Number(info.dataId)
  if(Number.isNaN(info.userId) || typeof info.userId !== 'number'){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }
  userId = Number(info.userId)

  let checkData
  try{
    checkData = await Data.findOne({
      where:{
        dataId,
      },
      attributes: [
        'typeId',
        'campusId',
        'userId',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  if(checkData === null){
    let err = new Error('data not Found')
    err.status = 404
    throw err
  }

  let result = {
    info:{
      typeId: checkData.typeId,
      campusId: checkData.campusId,
    },
  }
  if(checkData.userId !== userId){
    result.message = 'as a reviewer'
  }
  else{
    result.message = 'as an editor'
  }

  return result
}