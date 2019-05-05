import {Content, User, } from 'mid-long-term/models/association.js'
import Sequelize from 'sequelize'
const Op = Sequelize.Op

const parseInfo = async(dataId) => {
  try{
    let numUnreview = await Content.count({
      where: {
        dataId: dataId,
        [Op.and]: [ {isChecked: 0, }, {isConflicted: 0, }, ],
      },
    })

    let numChecked = await Content.count({
      where: {
        dataId: dataId,
        isChecked : 1,
      },
    })

    let numUnsolved = await Content.count({
      where: {
        dataId: dataId,
        [Op.and]: [{isChecked: 0, }, {isConflicted: 1, }, ],
      },
    })

    let time = await Content.findAll({
      where: {
        dataId: dataId,
      },
      attributes: [
        [Sequelize.fn('max', Sequelize.col('`content`.`updateTime`')), 'lastUpdateTime', ],
      ],
    })
    let total = numChecked+numUnsolved+numUnreview
    let unChecked = ((numUnreview/total)*100).toFixed(0)
    let isChecked = ((numChecked/total)*100).toFixed(0)
    let unsolved = ((numUnsolved/total)*100).toFixed(0)
    return {
      unChecked,
      isChecked,
      unsolved,
      updateTime: time[0].dataValues.lastUpdateTime,
    }
  } catch(err) {
    throw new Error('Error occurred in parse-year.js parseInfo', err)
  }
}


export default async(data) => {
  try{

    let t = {}
    await Promise.all(data.map(async data => {
      let info = await parseInfo(data.dataId)
      let user = await User.findOne({
        where: {
          userId: data.userId,
        },
      })

      if(t.hasOwnProperty(data.yearFrom)){
        t[data.yearFrom].push({
          year: data.yearTo,
          dataId: data.dataId,
          unChecked: info.unChecked,
          isChecked: info.isChecked,
          unsolved: info.unsolved,
          time: info.updateTime,
          user: {
            id: user.userId,
            name: user.account,
          },
        })
      }else {
        t[data.yearFrom] = []
        t[data.yearFrom].push({
          year: data.yearTo,
          dataId: data.dataId,
          unChecked: info.unChecked,
          isChecked: info.isChecked,
          unsolved: info.unsolved,
          time: info.updateTime,
          user: {
            id: user.userId,
            name: user.account,
          },
        })
      }
    }))
    let tt = []
    Object.keys(t).map(data => {
      tt.push({
        year: data,
        info: t[data],
      })
    })
    return tt
  }catch(err){
    throw new Error('Error ocurred in parse-year.js', err)
  }
}
