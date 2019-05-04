import Data from 'mid-long-term/models/schemas/Data.js'

const findCampusOne = async(info={}) =>{
  try{
    let campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.type,
      },
    })
    if(campus == null)
      return null
    else
      var {dataNew, } = campus

    return dataNew
  } catch(err){
    console.log(err)
  }
}


export default async(info={}) =>{
  try{
    let campus = await findCampusOne(info)
    if(campus !== null) return campus

    return Data.create({
      campusId: info.campusId,
      typeId: info.typeId,
      userId: info.userId,
      yearFrom: info.yearFrom,
      yearTo: info.yearTo,
    })
  }catch(err) {
    console.log(err)
  }
}