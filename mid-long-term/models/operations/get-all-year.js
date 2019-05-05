import {Data, } from 'mid-long-term/models/association.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import parseYear from 'mid-long-term/models/operations/parse-year.js'

export default async(info={}) => {
  try{
    let typeId = Number(info.typeId)
    let campusId = Number(info.campusId)
    if(Number.isNaN(typeId) || Number.isNaN(campusId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    let data = await Data.findAll({
      where:{
        typeId,
        campusId,
      },
      attributes: [
        'dataId',
        'yearFrom',
        'yearTo',
        'userId',
      ],
    })

    if(data.length === 0)
      return {
        typeName: '',
        campusName: '',
        yearFroms: [],
      }
    data = data.map(d => d.dataValues)
    let yearFroms = await parseYear(data)
    return {
      typeName: campusMap[info.typeId].type,
      campusName: campusMap[info.typeId].campus[info.campusId],
      yearFroms,
    }

  }catch(err) {
    if(!err.status){
      err = new Error('Error occurred in get-all-year.js')
      err.status = 500
    }
    throw err
  }
}


