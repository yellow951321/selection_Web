import Data from 'short-term/models/schemas/Data.js'

export default async(info={}) =>{
  try{
    const campusId = Number(info.campusId)
    const typeId = Number(info.typeId)
    const userId = Number(info.userId)
    const year = Number(info.year)

    if(Number.isNaN(campusId) || Number.isNaN(typeId) || Number.isNaN(userId) || Number.isNaN(year)){
      const err = new Error('Invalid arguments in data-create.')
      err.status = 400
      throw err
    }


    const campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.type,
      },
    })

    if(campus === null){
      Data.create({
        campusId,
        typeId,
        userId,
        year,
      })
    }
  }catch(err) {
    if(!err.status){
      err = new Error('Failed to create data.')
      err.status = 500
    }
    throw err
  }
}