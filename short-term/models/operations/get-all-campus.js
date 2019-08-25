import {Data, Content, User, } from 'short-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

const Op = Sequelize.Op

async function getCampusDetail(data) {
  const [
    user,
    numUnchecked,
    numChecked,
    numConfliced,
    lastUpdateTime,
  ] = await Promise.all([
    User.findOne({
      attributes: ['account', 'userId', ],
      where: {
        userId: data.userId,
      },
    }),
    Content.count({
      where: {
        dataId: data.dataId,
        [Op.and]: [ {isChecked: 0, }, {isConflicted: 0, }, ],
      },
    }),
    Content.count({
      where: {
        dataId: data.dataId,
        isChecked : 1,
      },
    }),
    Content.count({
      where: {
        dataId: data.dataId,
        [Op.and]: [{isChecked: 0, }, {isConflicted: 1, }, ],
      },
    }),
    Content.findAll({
      where: {
        dataId: data.dataId,
      },
      attributes: [
        [Sequelize.fn('max', Sequelize.col('`content`.`updateTime`')), 'lastUpdateTime', ],
      ],
    }),
  ])

  const numTotal = numUnchecked + numChecked + numConfliced
  data.user = {id: user.userId, name: user.account, }
  data.unchecked = numTotal !== 0 ? (numUnchecked / numTotal * 100).toFixed(0) : 0
  data.checked = numTotal !== 0 ?(numChecked / numTotal * 100).toFixed(0) : 0
  data.confliced = numTotal !== 0 ? (numConfliced / numTotal * 100).toFixed(0) : 0
  data.lastUpdateTime = lastUpdateTime[0].dataValues.lastUpdateTime
  data.campusName = campusMap[data.typeId].campus[data.campusId]

  return data
}


export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }
  let typeId, year
  if(Number.isNaN(info.typeId) || typeof info.typeId !== 'number'){
    const err = new Error('typeId is NaN')
    err.status = 400
    throw err
  }
  typeId = Number(info.typeId)
  if(Number.isNaN(info.year) || typeof info.year !== 'number'){
    const err = new Error('year is NaN')
    err.status = 400
    throw err
  }
  year = Number(info.year)
  let data
  try{
    data = await Data.findAll({
      where:{
        typeId,
        year,
      },
      attributes: [
        'dataId',
        'year',
        'userId',
        'campusId',
        'typeId',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }
  try{
    data = data.map(d => {
      return {
        dataId: d.dataId,
        year: d.year,
        userId: d.userId,
        campusId: d.campusId,
        typeId: d.typeId,
      }
    })
    return await Promise.all(data.map(d=>getCampusDetail(d)))
  }catch(err){
    err = new Error('formatting data failed')
    err.status = 500
    throw err
  }
}
