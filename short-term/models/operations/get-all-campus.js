import {Data, Content, User, } from 'short-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

const Op = Sequelize.Op

async function getCampusDetail(data) {
  if(typeof data !== 'object'){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

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

  return data
}


export default async(info={}) => {
  try{
    let typeId = Number(info.typeId)
    let yearId = Number(info.yearId)
    if(Number.isNaN(typeId) || Number.isNaN(yearId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    let data = await Data.findAll({
      where:{
        typeId,
        year: yearId,
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

    data = await Promise.all(data.map(d=>getCampusDetail(d)))
    data.forEach(c => {
      c.campusName = campusMap[c.typeId].campus[c.campusId]
    })
    return data
  }catch(err) {
    if(!err.status){
      err = new Error('Error occurred in get-all-campus.js')
      err.status = 500
    }
    throw err
  }
}
