import {Data, } from 'mid-long-term/models/association.js'

export default async(info={}) => {
  try{
    let data = await Data.findAll({
      where:{
        typeId: info.typeId,
        campusId: info.campusId,
      },
      attributes: [
        'dataId',
        'campusId',
        'typeId',
        'yearFrom',
        'yearTo',
        'userId',
      ],
    })

    return data.map(d => d.dataValues)

  }catch(err) {
    console.log(err)
  }
}


