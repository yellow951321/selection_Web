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
    // cast the campusId, typeId, userId, year to number type
    const campusId = Number(info.campusId)
    const typeId = Number(info.typeId)
    const userId = Number(info.userId)
    const year = Number(info.year)

    // check the campusId, typeId, userId, year whether equaal isNan or not
    if(Number.isNaN(campusId) || Number.isNaN(typeId) || Number.isNaN(userId) || Number.isNaN(year)){
      const err = new Error('Invalid arguments in data-create.')
      err.status = 400
      throw err
    }

    /*
      Find the campus with the given information
      if it is not null, then simply return 'OK'
      else create a new data in data table, then
      return 'OK'
    */
    const campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.typeId,
        year: info, year,
      },
    })
    /*
      if campus is null,then create a new campus into data table
    */
    if(campus === null){
      await Data.create({
        campusId,
        typeId,
        userId,
        year,
      })
    }
    return 'OK'
  }catch(err) {
    // error handling
    if(!err.status){
      err = new Error('Failed to create data.')
      err.status = 500
    }
    throw err
  }
}