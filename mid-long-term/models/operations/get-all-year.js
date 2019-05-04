import {Data, } from 'mid-long-term/models/association.js'
import campusMap from 'lib/static/javascripts/mapping/campus.js'
import parseYear from 'mid-long-term/models/operations/parse-year.js'

export default async(info={}) => {
  try{
    let data = await Data.findAll({
      where:{
        typeId: info.typeId,
        campusId: info.campusId,
      },
      attributes: [
        'dataId',
        'yearFrom',
        'yearTo',
        'userId',
      ],
    })

    data = data.map(d => d.dataValues)
    let yearFroms = await parseYear(data)
    return {
      typeName: campusMap[info.typeId].type,
      campusName: campusMap[info.typeId].campus[info.campusId],
      yearFroms,
    }

  }catch(err) {
    throw new Error('Error occurred in get-all-year.js', err)
  }
}


