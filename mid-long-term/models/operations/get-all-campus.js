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
  try{
    info.typeId = Number(info.typeId)
    if(Number.isNaN(info.typeId)){
      const err = new Error('typeId is NaN.')
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
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }

    /**
     * Transform a new array with new data structure
     */
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
      typeName: campusMap[info.typeId].type,
    }
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      err = new Error('fail at get-all-campus.js')
      err.status = 500
    }
    throw err
  }
}