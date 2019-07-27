import { midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import User from 'projectRoot/auth/models/schemas/user.js'

export default async(data) => {
  try{
    let inputIsNotArray = false
    if(!Array.isArray(data)){
      if(typeof data !== 'object'){
        let err = new Error('invalid data argument')
        err.status = 400
        throw err
      }

      data = [ data, ]
      inputIsNotArray = true
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues

      if(typeof data.contentId === 'number')
        temp.contentId = data.contentId
      else{
        let err = new Error('contentID is not a number')
        err.status = 400
      }
      if(typeof data.aspect === 'number')
        temp.aspect = data.aspect
      else{
        let err = new Error('aspect is not a number')
        err.status = 400
      }
      if(typeof data.keypoint === 'number')
        temp.keypoint = data.keypoint
      else{
        let err = new Error('keypoint is not a number')
        err.status = 400
      }
      if(typeof data.method === 'number')
        temp.method = data.method
      else{
        let err = new Error('method is not a number')
        err.status = 400
      }
      temp.method = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method, }).method
      temp.keypoint = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, }).keypoint
      temp.aspect = midLongTermFromNumber({aspect: temp.aspect, }).aspect

      if(typeof data.conflictedAspect === 'number'){
        temp.conflictedAspect = data.conflictedAspect
        if(typeof data.conflictedKeypoint === 'number')
          temp.conflictedKeypoint = data.conflictedKeypoint
        else{
          let err = new Error('conflictedKeypoint is not a number')
          err.status = 400
        }
        if(typeof data.conflictedMethod === 'number')
          temp.conflictedMethod = data.conflictedMethod
        else{
          let err = new Error('conflictedKeypoint is not a number')
          err.status = 400
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
        })
          .catch(()=>{
            let err = new Error('fail to fetch reviewerId')
            err.status = 500
          })
        temp.reviewerId = temp.reviewerId.account
      }
      return temp
    }))
    if(inputIsNotArray)
      return data[0]
    return data
  }
  catch(err){
    if(typeof err.status === 'number'){
      let err = new Error('operation lebel-fron-number failed')
      err.status = 500
    }
    throw err
  }
}