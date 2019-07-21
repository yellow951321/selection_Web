import { midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import User from 'projectRoot/auth/models/schemas/user.js'

export default async(data) => {
  try{
    let inputIsNotArray = false
    if(!(data instanceof Array)){
      data = [ data, ]
      inputIsNotArray = true
    }
    data = await Promise.all(data.map(async(data) => {
      let temp = data.dataValues
      if(data.contentId)
        temp.contentId = data.contentId
      temp.method = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method, }).method
      temp.keypoint = midLongTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, }).keypoint
      temp.aspect = midLongTermFromNumber({aspect: temp.aspect, }).aspect

      if(temp.conflictedAspect instanceof Number){
        temp.conflictedMethod = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod, }).method
        temp.conflictedKeypoint = midLongTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, }).keypoint
        temp.conflictedAspect = midLongTermFromNumber({aspect: temp.conflictedAspect, }).aspect
      }
      if(typeof temp.reviewerId === 'number' && temp.reviewerId !== 0){
        temp.reviewerId = await User.findOne({
          where: {
            userId: temp.reviewerId,
          },
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
    if(!err.status){
      err = new Error('label-from-number failed')
      err.status = 500
    }
    throw err
  }
}