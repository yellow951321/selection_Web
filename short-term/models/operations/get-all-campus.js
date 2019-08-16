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


export default async(info={}) => {
  try{
    let typeId = Number(info.typeId)
    let year = Number(info.year)
    if(Number.isNaN(typeId)){
      const err = new Error('typeId argument')
      err.status = 400
      throw err
    }
    if(Number.isNaN(year)){
      const err = new Error('year argument')
      err.status = 400
      throw err
    }
    let data = await Data.findAll({
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
    data = data.map(d => {
      return {
        dataId: d.dataId,
        year: d.year,
        userId: d.userId,
        campusId: d.campusId,
        typeId: d.typeId,
      }
    })

    return Promise.all(data.map(d=>getCampusDetail(d)))
  }catch(err) {
    if(typeof err.status !== 'number'){
      err = new Error('Error occurred in get-all-campus.js')
      err.status = 500
    }
    throw err
  }
}
