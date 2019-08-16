import {Data, Content, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

/**
 * return the whole campus information
 * @function getAllCampus
 * @param {object} info
 * @param {number} info.year - The year of the campus
 * @param {number} info.typeId - The type of the campus
 * @returns {array} - Each element represent a content of campus
 * @requires 'short-term/models/association.js'
 * @requires Sequelize
 * @requires 'lib/static/javascripts/mapping/campus.js'
 */
export default async(info) => {
  if(typeof info !== 'object' || info === null){
    const err = new Error('invalid argument')
    err.status = 400
    throw err
  }


  if(info.typeId !== 1 && info.typeId !== 0){
    const err = new Error('typeId is not valid.')
    err.status = 400
    throw err
  }

  let data
  try{
    /**
       * find all campus data with the given typeId and yearId.
          And, we set the attributes as [
          'dataId',
          'year',
          'userId',
          'campusId',
          'typeId',
        ]
       */
    data = await Data.findAll({
      where:{
        typeId: info.typeId,
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
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }


  data = data.map(data => {
    return {
      id: data.campusId,
      name: campusMap[data.typeId].campus[data.campusId],
      time: data.content.length != 0 ? data.content[0].dataValues.lastUpdateTime : null,
    }
  })

  return {
    campuses: data,
    typeName: campusMap[info.typeId].type,
  }
}