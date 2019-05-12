import Data from 'mid-long-term/models/schemas/Data.js'

export default async(info={}) =>{
  try{
    const campusId = Number(info.campusId)
    const typeId = Number(info.typeId)
    const userId = Number(info.userId)
    const yearFrom = Number(info.yearFrom)
    const yearTo = Number(info.yearTo)

    if(Number.isNaN(campusId) || Number.isNaN(typeId) || Number.isNaN(userId) || Number.isNaN(yearFrom) || Number.isNaN(yearTo)) {
      const err = new Error('Invalid arguments in data-create.')
      err.status = 400
      throw err
    }


    const campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.typeId,
        yearFrom: info.yearFrom,
        yearTo: info.yearTo,
      },
    })

    if(campus === null){
      Data.create({
        campusId,
        typeId,
        userId,
        yearFrom,
        yearTo,
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