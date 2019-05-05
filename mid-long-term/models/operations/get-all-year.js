import {Content, Data, User, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

async function getYearDetail(data) {
  const [
    user,
    numUnchecked,
    numChecked,
    numConfliced,
    lastUpdateTime,
  ] = await Promise.all([
    User.findOne({
      attributes: ['account', ],
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
  data.user = user.account
  data.unchecked = (numUnchecked / numTotal * 100).toFixed(0)
  data.checked = (numChecked / numTotal * 100).toFixed(0)
  data.confliced = (numConfliced / numTotal * 100).toFixed(0)
  data.lastUpdateTime = lastUpdateTime[0].dataValues.lastUpdateTime

  return data
}

export default async(info={}) => {
  try{
    let typeId = Number(info.typeId)
    let campusId = Number(info.campusId)
    if(Number.isNaN(typeId) || Number.isNaN(campusId)){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }
    let data = await Data.findAll({
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

    data = data.map(d => {
      return {
        dataId: d.dataId,
        yearFrom: d.yearFrom,
        yearTo: d.yearTo,
        userId: d.userId,
      }
    })

    data = await Promise.all(data.map(d=>getYearDetail(d)))
    data.sort((data1, data2)=>{
      if(data1.yearFrom !== data2.yearFrom)
        return data1.yearFrom - data2.yearFrom
      else
        return data1.yearTo - data2.yearTo
    })
    return data
  }catch(err) {
    
    if(!err.status){
      err = new Error('Error occurred in get-all-year.js', err)
      err.status = 500
    }
    throw err
  }
}
