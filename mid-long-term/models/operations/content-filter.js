
import Content from 'projectRoot/mid-long-term/models/schemas/Content'
import Data from 'projectRoot/mid-long-term/models/schemas/Data'
import User from 'projectRoot/auth/models/schemas/user.js'
import {map, getFromNum, getFromWord, } from 'projectRoot/data/operation/mapping'


const isString = (x) => {
  if(typeof x == 'string' || x instanceof String){
    return true
  }
  return false
}

export default async(info = {}) => {
  try{
    if(!isString(info.aspect) || !isString(info.keypoint) || !isString(info.method)) {
      let err = new Error('invalid argument of aspect or keypoint or method')
      err.status = 400
      throw err
    }
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













