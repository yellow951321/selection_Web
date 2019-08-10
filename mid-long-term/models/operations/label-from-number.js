import { midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import {User, } from 'mid-long-term/models/association.js'

export default async(data) => {
  let inputIsNotArray = false
  if(!Array.isArray(data)){
    if(typeof data !== 'object' || data === null){
      const err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    data = [ data, ]
    inputIsNotArray = true
  }
  try{
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues === undefined ? {} : data.dataValues
      if(typeof data.contentId === 'number' && !Number.isNaN(data.contentId))
        temp.contentId = data.contentId
      else{
        const err = new Error('contentId is NaN')
        err.status = 400
        throw err
      }
      if(typeof data.aspect === 'number' && !Number.isNaN(data.aspect))
        temp.aspect = data.aspect
      else{
        const err = new Error('aspect is NaN')
        err.status = 400
        throw err
      }
      if(typeof data.keypoint === 'number' && !Number.isNaN(data.keypoint))
        temp.keypoint = data.keypoint
      else{
        const err = new Error('keypoint is NaN')
        err.status = 400
        throw err
      }
      if(typeof data.method === 'number'&& !Number.isNaN(data.method))
        temp.method = data.method
      else{
        const err = new Error('method is NaN')
        err.status = 400
        throw err
      }
      temp.method = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method, }).method
      temp.keypoint = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, }).keypoint
      temp.aspect = midLongTermFromNumber({aspect: temp.aspect, }).aspect

      if(typeof data.conflictedAspect === 'number' && !Number.isNaN(data.conflictedAspect)){
        temp.conflictedAspect = data.conflictedAspect
        if(typeof data.conflictedKeypoint === 'number' && !Number.isNaN(data.conflictedKeypoint))
          temp.conflictedKeypoint = data.conflictedKeypoint
        else{
          const err = new Error('conflictedKeypoint is NaN')
          err.status = 400
          throw err
        }
        if(typeof data.conflictedMethod === 'number' && !Number.isNaN(data.conflictedMethod))
          temp.conflictedMethod = data.conflictedMethod
        else{
          const err = new Error('conflictedMethod is NaN')
          err.status = 400
          throw err
        }
        temp.conflictedMethod = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod, }).method
        temp.conflictedKeypoint = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, }).keypoint
        temp.conflictedAspect = midLongTermFromNumber({aspect: temp.conflictedAspect, }).aspect
      }
      if(typeof data.reviewerId === 'number' && data.reviewerId !== 0){
        temp.reviewerId = data.reviewerId
        temp.reviewerId = await User.findOne({
          where: {
            userId: temp.reviewerId,
          },
          attributes: [
            'account',
          ], }
        )
        temp.reviewerId = temp.reviewerId.account
      }
      return temp
    }))
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('fail to fetch reviewerId')
      err.status = 500
    }
    throw err
  }

  if(inputIsNotArray)
    return data[0]
  return data
}