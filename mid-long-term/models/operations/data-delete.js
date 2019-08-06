import Data from 'mid-long-term/models/schemas/Data.js'
/**
 * Create a new Campus into database with the given information.
 * WARNING: There is no remedy to recover the deleted data.
 * @function dataDelete
 * @param {number} dataId - The ID of the data
 * @param {number} userId - The ID of userID
 * @returns {object} - return the deleted data in data table
 * @thorows - Throw an error if the dataId == isNan
 */
export default async(dataId, userId) => {
  try {
    /**
     * Convert the dataId & userId into number type explicitly
     */
    dataId = Number(dataId)
    userId = Number(userId)
    /**
     * Validate whether the `dataId` is `NaN` or not.
     */
    if(Number.isNaN(dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate whether the `userId` is `NaN` or not.
     */
    if(Number.isNaN(userId)){
      const err = new Error('userId is NaN')
      err.status = 400
      throw err
    }
    let data
    try{
      data = await Data.findOne({
        where: {
          dataId: dataId,
        },
        attribute: [
          'userId',
        ],
      })

      if(data === null){
        const err = new Error('No specified dataId')
        err.status = 400
        throw err
      }
    }catch(err){
      /**
       * Catch the error when `Data.findOne` failed
       */
      err = new new Error('data fetch failed.')
      err.status = 500
    }

    if(data.userId !== userId){
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }

    try{
     return Data.destroy({
        where: {
          dataId: dataId,
        },
      })
    }
    catch(err){
      /**
       * Catch the exception when `Data.destroy` failed
       */
      err = new new Error('data delete failed.')
      err.status = 500
    }
  }catch (err) {
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      err = new Error('Failed to delete data.')
      err.status = 500
    }
    throw err
  }
}