import {Data, Content, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

export default async(typeId) => {
  try{
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
      return {
        id: data.campusId,
        name: campusMap[data.typeId].campus[data.campusId],
        time: data.content[0].dataValues.lastUpdateTime,
      }
    })
    return data
  }catch(err){
    console.log(err)
  }
}