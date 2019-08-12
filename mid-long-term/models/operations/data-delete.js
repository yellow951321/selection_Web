import {Data, } from 'mid-long-term/models/association.js'

export default async(dataId, userId) => {
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
    err = new Error('data fetch failed')
    err.status = 500
    throw err
  }

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

  try{
    output = await Data.destroy({
      where: {
        dataId: dataId,
      },
    })
  }
  catch(err){
    err = new Error('data delete failed')
    err.status = 500
    throw err
  }
  return output
}