import Data from 'mid-long-term/models/schemas/Data.js'

export default async(info={}) =>{
  try{
    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.campusId = Number(info.campusId)
    info.typeId = Number(info.typeId)
    info.userId = Number(info.userId)
    info.yearFrom = Number(info.yearFrom)
    info.yearTo = Number(info.yearTo)

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
    if(Number.isNaN(info.yearFrom)){
      const err = new Error('yearFrom is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.yearTo)){
      const err = new Error('yearTo is NaN')
      err.status = 400
      throw err
    }
    let campus, result
    try{
      campus = await Data.findOne({
        where:{
          campusId: info.campusId,
          typeId: info.typeId,
          yearFrom: info.yearFrom,
          yearTo: info.yearTo,
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
          yearFrom: info.yearFrom,
          yearTo: info.yearTo,
        })
      }
    }catch(err){
      err = new Error('data create fail')
      err.status = 500
      throw err
    }

    return result
  }catch(err) {
    if(!err.status){
      err = new Error('Failed to create data.')
      err.status = 500
    }
    throw err
  }
}