import {Content, Data, User, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

async function getYearDetail(data) {
  try{
    data.dataId = Number(data.dataId)
    data.userId = Number(data.userId)
    
    if(Number.isNaN(data.dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(data.userId)){
      const err = new Error('userId is NaN')
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
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('getYearDeatail failed')
      err.status = 500
    }
    throw err
  }
}

export default async(info={}) => {
  try{
    info.typeId = Number(info.typeId)
    info.campusId = Number(info.campusId)
    if(Number.isNaN(info.typeId)){
      const err = new Error('typeId is NaN')
      err.status = 400
      throw err      
    }
    if(Number.isNaN(info.campusId)){
      const err = new Error('campusId is NaN')
      err.status = 400
      throw err      
    }

    let data
    try{
      data = await Data.findAll({
        where:{
          typeId: info.typeId,
          campusId: info.campusId,
        },
        attributes: [
          'dataId',
          'yearFrom',
          'yearTo',
          'userId',
        ],
      })
    }catch(err){
      err = new Error('data fetch failed')
      err.status = 400
      throw err
    }

    try{
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
    }catch(err){
      err = new Error('data formatting failed')
      err.status = 400
      throw err
    }

    return data
  }catch(err) {
    if(!err.status){
      err = new Error('Error occurred in get-all-year.js')
      err.status = 500
    }
    throw err
  }
}
