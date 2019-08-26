import {Data, } from 'short-term/models/association.js'

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
<<<<<<< HEAD
  try {
    // conver the dataId & userId into number type explicitly
    dataId = Number(dataId)
    userId = Number(userId)
    // check the dataId is isNaN or not
    if(Number.isNaN(dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(userId)){
      const err = new Error('userId is NaN')
      err.status = 400
      throw err
    }
    let data, output
    try{
      data = await Data.findOne({
        where: {
          dataId: dataId,
        },
        attribute: [
          'userId',
        ],
      })
    }catch(err){
      err = new new Error('data fetch failed.')
      err.status = 500
    }
=======
  if(Number.isNaN(Number(dataId)) || typeof dataId !== 'number'){
    const err = new Error('dataId is NaN')
    err.status = 400
    throw err
  }
  dataId = Number(dataId)
  if(Number.isNaN(Number(userId)) || typeof userId !== 'number'){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }
  userId = Number(userId)
  let data, output
  try{
    data = await Data.findOne({
      where: {
        dataId: dataId,
      },
      attribute: [
        'userId',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }
>>>>>>> 187c312727e947cd8f91262dd7070a0d6a18e2dc

  if(data === null){
    const err = new Error('No specified dataId')
    err.status = 400
    throw err
  }
  if(data.userId !== userId){
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }

<<<<<<< HEAD
    try{
      output = await Data.destroy({
        where: {
          dataId: dataId,
        },
      })
    }
    catch(err){
      err = new new Error('data delete failed.')
      err.status = 500
    }
    return output
  }catch (err) {
    // error handling
    if(!err.status){
      err = new Error('Failed to delete data.')
      err.status = 500
    }
=======
  try{
    output = await Data.destroy({
      where: {
        dataId: dataId,
      },
    })
  }
  catch(err){
    err = new Error('deleting data failed')
    err.status = 500
>>>>>>> 187c312727e947cd8f91262dd7070a0d6a18e2dc
    throw err
  }
  return output
}