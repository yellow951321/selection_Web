/**
 * Create a new Campus into database with the given information.
 * WARNING: There is no remedy to recover the deleted data.
 * @function dataDelete
 * @param {number} dataId - The ID of the data
 * @param {number} userId - The ID of userID
 * @returns {object} - return the deleted data in data table
 * @thorows - Throw an error if the dataId == isNan
 */
// import Data module
import Data from 'short-term/models/schemas/Data.js'

export default async(dataId, userId) => {
  try {
    // conver the dataId & userId into number type explicitly
    dataId = Number(dataId)
    userId = Number(userId)
    // check the dataId is isNaN or not
    if(Number.isNaN(dataId)){
      const err = new Error('invalid dataId')
      err.status = 400
      throw err
    }
    // find the data needed to be deleted
    let data = await Data.findOne({
      where: {
        dataId: dataId,
      },
      attribute: [
        'userId',
      ],
    })
    /*
    Check whether the userId of data is identical to the userId or not.
    It is only permitted when the user owns the data
    */
    if(data.userId !== userId){
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }
    /*
    if the userId is identical to the data.userId,
    delete the data. WARNING : there is no remedy
    to recover the data back
    */
    let output = await Data.destroy({
      where: {
        dataId: dataId,
      },
    })
    return output
  }catch (err) {
    // error handling
    if(!err.status){
      err = new Error('Failed to delete data.')
      err.status = 500
    }
    throw err
  }
}