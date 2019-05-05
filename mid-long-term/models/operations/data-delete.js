import Data from 'mid-long-term/models/schemas/Data.js'

export default async(dataId, userId) => {
  try {
    dataId = Number(dataId)
    userId = Number(userId)
    if(Number.isNaN(dataId)){
      const err = new Error('invalid dataId')
      err.status = 400
      throw err
    }
    let data = await Data.findOne({
      where: {
        dataId: dataId,
      },
      attribute: [
        'userId',
      ],
    })
    if(data.userId !== userId){
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }
    let output = await Data.destroy({
      where: {
        dataId: dataId,
      },
    })
    return output
  }catch (err) {
    if(!err.status){
      err = new Error('Failed to delete data.')
      err.status = 500
    }
    throw err
  }
}