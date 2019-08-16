/**
 * @requires 'projectRoot/short-term/models/schemas/Content.js'
 * @requires 'projectRoot/auth/models/schemas/user.js'
 * @requires 'projectRoot/data/operation/mapping'
 * @function content-filter
 * @param {object} info
 * @param {string} info.aspect - The aspect of wanted data
 * @param {string} info.keypoint - The keypoint of wanted data
 * @param {string} info.method - The method of wanted data
 * @param {number} info.dataId - The dataId of wanted data
 * @returns {array} - the content data
 * @thorws will throw an error if the info.aspect | info.keypoint | info.method is not string
 */
// import the Content Module
import Content from 'projectRoot/short-term/models/schemas/Content'
// import the User Module
import User from 'projectRoot/auth/models/schemas/user.js'
// import the mapping.js
import {map, getFromWord, } from 'projectRoot/data/operation/mapping'

// The inner function to check whether the inptu is string or not
const isString = (x) => {
  if(typeof x == 'string' || x instanceof String){
    return true
  }
  return false
}

export default async(info = {}) => {
  try{
    // check the info.aspect & info.keypoint & info.method is string or not
    if(!isString(info.aspect) || !isString(info.keypoint) || !isString(info.method)) {
      let err = new Error('invalid argument of aspect or keypoint or method')
      err.status = 400
      throw err
    }
    // mapping the aspect, keypoint, method (str) to the corresponding ID (number)
    const aspect = getFromWord(map, {dimension: info.aspect, })
    const keypoint = getFromWord(map, {item: info.keypoint, })
    const method = getFromWord(map, { detail: info.method, })

    let data = await Content.findAll({
      where: {
        dataId: info.dataId,
        aspect,
        keypoint,
        method,
      },
      attributes: [
        'contentId',
        'title1',
        'title2',
        'title3',
        'title4',
        'content',
        'summary',
        'note',
        'pageFrom',
        'pageTo',
        'aspect',
        'keypoint',
        'method',
        'isChecked',
        'reviewerId',
        'isConflicted',
        'updateTime',
        'dataId',
      ],
    })
    if(data === []){
      return 'empty'
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues
      if(temp.reviewerId){
        temp.reviewerId = await User.findOne({
          where: {
            userId: temp.reviewerId,
          },
        })
        temp.reviewerId = temp.reviewerId.dataValues.account
      }
      return temp
    }))
    return data
  } catch(err) {
    if(!err.status){
      err = new Error('Error occurred in content-filter.js', err)
      err.status = 500
    }
    throw err
  }
}













