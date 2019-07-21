import { shortTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import User from 'projectRoot/auth/models/schemas/user.js'

export default async(data) => {
  try{
    let inputIsNotArray = false
    if(!Array.isArray(data)){
      data = [ data, ]
      inputIsNotArray = true
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = {}

      if(!Number.isNaN(data.contentId))
        temp.contentId = data.contentId
      else{
        let err = new Error('contentID is not a number')
        err.status = 400
      }

      if(!Number.isNaN(data.aspect))
        temp.aspect = data.aspect
      else{
        let err = new Error('aspect is not a number')
        err.status = 400
      }
      if(!Number.isNaN(data.keypoint))
        temp.keypoint = data.keypoint
      else{
        let err = new Error('keypoint is not a number')
        err.status = 400
      }
      if(!Number.isNaN(data.method))
        temp.method = data.method
      else{
        let err = new Error('method is not a number')
        err.status = 400
      }

      temp.method = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method, }).method
      temp.keypoint = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, }).keypoint
      temp.aspect = shortTermFromNumber({aspect: temp.aspect, }).aspect

      if(!Number.isNaN(temp.conflictedAspect)){
        if(!Number.isNaN(data.conflictedKeypoint))
          temp.conflictedKeypoint = data.conflictedKeypoint
        else{
          let err = new Error('conflictedKeypoint is not a number')
          err.status = 400
        }
        if(!Number.isNaN(data.conflictedMethod))
          temp.conflictedMethod = data.conflictedMethod
        else{
          let err = new Error('conflictedKeypoint is not a number')
          err.status = 400
        }
        temp.conflictedMethod = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod, }).method
        temp.conflictedKeypoint = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, }).keypoint
        temp.conflictedAspect = shortTermFromNumber({aspect: temp.conflictedAspect, }).aspect
      }
      if(Number.isNaN(data.reviewerId) && data.reviewerId !== 0){
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
    if(Number.isNaN(err.status)){
      let err = new Error('operation lebel-fron-number failed')
      err.status = 500
    }
    throw err
  }
}