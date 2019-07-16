import {Data, Content, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

export default async(typeId) => {
  try{
    typeId= Number(typeId)

    if(Number.isNaN(typeId)){
      const err = new Error('Invalid arguments in data-create.')
      err.status = 400
      throw err
    }
    // find all data with the given userId and typeId
    let data = await Data.findAll({
      where:{
        typeId: typeId,
      },
      attributes: [
        'campusId',
        'typeId',
      ],
      group: ['campusId', ],
      include: [
        {
          model: Content,
          as: 'content',
          attributes: [[Sequelize.fn('max', Sequelize.col('`content`.`updateTime`')), 'lastUpdateTime', ], ],
        },

      ],
    })

    // transfer data into column campusId only
    data = data.map(data => {
      console.log(JSON.stringify(data.dataValues))
      return {
        id: data.campusId,
        name: campusMap[data.typeId].campus[data.campusId],
        time: data.content.length != 0 ? data.content[0].dataValues.lastUpdateTime : null,
      }
    })

    return {
      campuses: data,
      typeName: campusMap[typeId].type,
    }

  }catch(err){
    if(!err.status){
      err = new Error('faile at get-all-campus.js')
      err.status = 500
    }
    throw err
  }
}