import {Content, Data, User, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

async function getYearDetail(data) {
  let user, numUnchecked, numChecked, numConfliced, lastUpdateTime
  [
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
  data.lastUpdateTime = lastUpdateTime[0].lastUpdateTime

  return data
}

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let typeId, campusId
  if(Number.isNaN(info.typeId) || typeof info.typeId !== 'number'){
    const err = new Error('typeId is NaN')
    err.status = 400
    throw err
  }
  typeId = Number(info.typeId)
  if(Number.isNaN(info.campusId) || typeof info.campusId !== 'number'){
    const err = new Error('campusId is NaN')
    err.status = 400
    throw err
  }
  campusId = Number(info.campusId)
  let data
  try{
    data = await Data.findAll({
      where:{
        typeId,
        campusId,
      },
      attributes: [
        'dataId',
        'yearFrom',
        'yearTo',
        'userId',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }
  let outputData
  try{
    data = data.map(d => {
      return {
        dataId: Number(d.dataId),
        yearFrom: Number(d.yearFrom),
        yearTo: Number(d.yearTo),
        userId: Number(d.userId),
      }
    })

    outputData = await Promise.all(data.map(d=>getYearDetail(d)))
    outputData.sort((data1, data2)=>{
      if(data1.yearFrom !== data2.yearFrom)
        return data1.yearFrom - data2.yearFrom
      else
        return data1.yearTo - data2.yearTo
    })
  }catch(err){
    err = new Error('formatting data failed')
    err.status = 500
    throw err
  }

  return outputData
}
