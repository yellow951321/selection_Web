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
// import Data Module
import Data from 'short-term/models/schemas/Data.js'

export default async(info={}) =>{
  try{
    info.campusId = Number(info.campusId)
    info.typeId = Number(info.typeId)
    info.userId = Number(info.userId)
    info.year = Number(info.year)

    if(Number.isNaN(info.campusId)){
      let err = new Error('campusId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.typeId)){
      let err = new Error('typeId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.userId)){
      let err = new Error('userId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.year)){
      let err = new Error('year is NaN')
      err.status = 400
      throw err
    }

    let campus, result
    try{
      campus = await Data.findOne({
        where:{
          campusId: info.campusId,
          typeId: info.typeId,
          year: info.year,
        },
      })
    }catch(err){
      err = new Error('data fetch fail')
      err.status = 500
      throw err
    }

    try{
      if(campus === null){
        result = await Data.create({
          campusId: info.campusId,
          typeId: info.typeId,
          userId: info.userId,
          year: info.year,
        })
      }
    }
    catch(err){
      err = new Error('data create fail')
      err.status = 500
      throw err
    }

    return result
  }catch(err) {
    // error handling
    if(!err.status){
      err = new Error('Failed to create data.')
      err.status = 500
    }
    throw err
  }
}