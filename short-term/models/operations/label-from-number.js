import { shortTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import User from 'projectRoot/auth/models/schemas/user.js'

export default async(data) => {
  let inputIsNotArray = false
  if(!(data instanceof Array)){
    data = [ data, ]
    inputIsNotArray = true
  }
  data = await Promise.all(data.map(async(data) => {
    let temp = data.dataValues
    if(data.contentId)
      temp.contentId = data.contentId
    temp.method = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, method: temp.method, }).method
    temp.keypoint = shortTermFromNumber({aspect: temp.aspect, keypoint: temp.keypoint, }).keypoint
    temp.aspect = shortTermFromNumber({aspect: temp.aspect, }).aspect

    if(temp.conflictedAspect instanceof Number){
      temp.conflictedMethod = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, method: temp.conflictedMethod, }).method
      temp.conflictedKeypoint = shortTermFromNumber({aspect: temp.conflictedAspect, keypoint: temp.conflictedKeypoint, }).keypoint
      temp.conflictedAspect = shortTermFromNumber({aspect: temp.conflictedAspect, }).aspect
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