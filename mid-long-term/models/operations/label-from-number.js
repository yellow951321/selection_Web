import { midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'
import {User, } from 'mid-long-term/models/association.js'

export default async(data) => {
  if(typeof data !== 'object' || data === null || Array.isArray(data)){
    const err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let temp = {}
  temp.updateTime = data.updateTime
  if(typeof data.title1 !== 'string' && typeof data.title1 !== 'undefined' && data.title1 !== null){
    const err = new Error('title1 is not valid')
    err.status = 400
    throw err
  }
  temp.title1 = data.title1
  if(typeof data.title2 !== 'string' && typeof data.title2 !== 'undefined' && data.title2 !== null){
    const err = new Error('title2 is not valid')
    err.status = 400
    throw err
  }
  temp.title2 = data.title2
  if(typeof data.title3 !== 'string' && typeof data.title3 !== 'undefined' && data.title3 !== null){
    const err = new Error('title3 is not valid')
    err.status = 400
    throw err
  }
  temp.title3 = data.title3
  if(typeof data.title4 !== 'string' && typeof data.title4 !== 'undefined' && data.title4 !== null){
    const err = new Error('title4 is not valid')
    err.status = 400
    throw err
  }
  temp.title4 = data.title4
  if(typeof data.content !== 'string' && typeof data.content !== 'undefined' && data.content !== null){
    const err = new Error('content is not valid')
    err.status = 400
    throw err
  }
  temp.content = data.content
  if(typeof data.summary !== 'string' && typeof data.summary !== 'undefined' && data.summary !== null){
    const err = new Error('summary is not valid')
    err.status = 400
    throw err
  }
  temp.summary = data.summary
  if(typeof data.note !== 'string' && typeof data.note !== 'undefined' && data.note !== null){
    const err = new Error('note is not valid')
    err.status = 400
    throw err
  }
  temp.note = data.note
  if(data.isChecked !== -1 && typeof data.isChecked !== 1 && data.isChecked !== 0 && data.isChecked !== undefined){
    const err = new Error('isChecked is not valid')
    err.status = 400
    throw err
  }
  temp.isChecked = data.isChecked
  if(data.isConflicted !== -1 && typeof data.isConflicted !== 1 && data.isConflicted !== 0 && data.isConflicted !== undefined){
    const err = new Error('isConflicted is not valid')
    err.status = 400
    throw err
  }
  temp.isConflicted = data.isConflicted

  if(data.dataId === undefined || (typeof data.dataId === 'number' && !Number.isNaN(data.dataId)))
    temp.dataId = data.dataId
  else{
    const err = new Error('dataId is not valid')
    err.status = 400
    throw err
  }

  if(typeof data.contentId === 'number' && !Number.isNaN(data.contentId))
    temp.contentId =data.contentId
  else{
    const err = new Error('contentId is NaN')
    err.status = 400
    throw err
  }
  if(data.pageFrom === undefined || (typeof data.pageFrom === 'number' && !Number.isNaN(data.pageFrom)))
    temp.pageFrom = data.pageFrom
  else{
    const err = new Error('pageFrom is NaN')
    err.status = 400
    throw err
  }
  if(data.pageTo === undefined || (typeof data.pageTo === 'number' && !Number.isNaN(data.pageTo)))
    temp.pageTo = data.pageTo
  else{
    const err = new Error('pageTo is NaN')
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
  try{
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
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('fail to transfer label from number')
      err.status = 500
    }
    throw err
  }
  try{
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
  }
  catch(err){
    err = new Error('fail to fetch reviewerId')
    err.status = 500
    throw err
  }
  return temp
}