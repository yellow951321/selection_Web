import {Data, Content, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    const err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  info.typeId = Number(info.typeId)
  if(Number.isNaN(info.typeId)){
    const err = new Error('typeId is NaN.')
    err.status = 400
    throw err
  }

  let data
  try{
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

  try{
    // transfer data into column campusId only
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
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('fail at get-all-campus.js')
      err.status = 500
    }
    throw err
  }
}