/**
 * @file Create a new Campus into database given the following information
 */
import Data from 'short-term/models/schemas/Data.js'

/**
 * Create a new Campus into database given the following information
 * @function dataCreate
 * @param {object} info
 * @param {number} info.campusId - The ID of campus name
 * @param {number} info.typeId - The ID of the type(0 or 1)
 * @param {number} info.userId - The ID of the user
 * @param {number} info.year - The year
 * @returns {string} - return a OK to represent this op is work correctly
 * @thorows - Throw an error if the campusId | typeId | userId | year == isNan
 */

export default async(info={}) =>{
  try{
    if(typeof info !== 'object'){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.campusId = Number(info.campusId)
    info.typeId = Number(info.typeId)
    info.userId = Number(info.userId)
    info.year = Number(info.year)

    if(Number.isNaN(info.campusId)){
      const err = new Error('campusId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.typeId)){
      const err = new Error('typeId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.userId)){
      const err = new Error('userId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.year)){
      const err = new Error('year is NaN')
      err.status = 400
      throw err
    }
  }catch(err) {
    if(!err.status){
      err = new Error('invalid argument')
      err.status = 400
    }
    throw err
  }

  try{
    const campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.typeId,
        year: info.year,
      },
    })
    if(campus !== null){
      err = new Error('data already exist')
      err.status = 400
      throw err
    }

    return result
  }catch(err) {
    // error handling
    if(!err.status){
      err = new Error('data fetch fail')
      err.status = 500
    }
    throw err
  }

  try{
    return Data.create({
      campusId: info.campusId,
      typeId: info.typeId,
      userId: info.userId,
      year: info.year,
    })
  }
  catch(err){
    err = new Error('data create fail')
    err.status = 500
    throw err
  }
}