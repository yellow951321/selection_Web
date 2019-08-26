import {Data, Content, User, } from 'short-term/models/association.js'
import Sequelize from 'sequelize'
import campusMap from 'lib/static/javascripts/mapping/campus.js'

// Assign Variable Op to a Sequelize.Op
const Op = Sequelize.Op

/**
 * @typedef {object} userInfo
 * @property {number} id - The id of user
 * @property {string} name - The account of the user
 */

/**
 * @typedef {object} CampusDetail
 * @property {userInfo} user - The userInfo type object
 * @property {number} unchecked - the number of the content which is unchecked
 * @property {number} checked - the number of the content which is checked
 * @property {number} confliced - numConflicted : the number of the content which is conflicted
 * @property {string} lastUpdateTime - the last modified time
 */

/**
 * The auxiliary function to finished the statistics of data
 * @function getCampusDetail
 * @param {object} data - A campus data, it is needed to compute some statistics
 * @returns {CampusDetail} - The statistics of campus
*/
async function getCampusDetail(data) {

  /*
  use the Promise.all to get the
  1. user : {id, name}
  2. numUncheked : the number of the content which is unchecked
  3. numChecked : the number of the content which is checked
  4. numConflicted : the number of the content which is conflicted
  5. The lastUpdataTime : the last modified time
   */
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
  // sum the `unchecked` and `Checked` and `Conflicted`
  const numTotal = numUnchecked + numChecked + numConfliced
  // assign the details as a property of the data
  data.user = {id: user.userId, name: user.account, }
  data.unchecked = numTotal !== 0 ? (numUnchecked / numTotal * 100).toFixed(0) : 0
  data.checked = numTotal !== 0 ?(numChecked / numTotal * 100).toFixed(0) : 0
  data.confliced = numTotal !== 0 ? (numConfliced / numTotal * 100).toFixed(0) : 0
  data.lastUpdateTime = lastUpdateTime[0].dataValues.lastUpdateTime
  return data
}
/**
 * Return the total details of total campus with the given information
 * @function getAllCampus
 * @param {object} info
 * @param {number} info.typeId
 * @param {number} info.yearId
 * @returns {CampusDetail[]}
 * @throws - throw an error message if the typeId or yearId is isNaN value
 */

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
    /*
    use Promise.all method to execute the getCampusDetail func
     */
    return await Promise.all(data.map(d=>getCampusDetail(d)))
  }catch(err){
    err = new Error('formatting data failed')
    err.status = 500
    throw err
  }
}
