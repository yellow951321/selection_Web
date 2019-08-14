import {Content, } from 'mid-long-term/models/association.js'
import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let dataId, aspect, keypoint, method
  if(Number.isNaN(info.dataId) || typeof info.dataId !== 'number'){
    const err = new Error('dataId is NaN')
    err.status = 400
    throw err
  }
  dataId = Number(info.dataId)
  if(Number.isNaN(info.aspect) || typeof info.aspect !== 'number'){
    const err = new Error('aspect is NaN')
    err.status = 400
    throw err
  }
  aspect = Number(info.aspect)
  if(Number.isNaN(info.keypoint) || typeof info.keypoint !== 'number'){
    const err = new Error('keypoint is NaN')
    err.status = 400
    throw err
  }
  keypoint = Number(info.keypoint)
  if(Number.isNaN(info.method) || typeof info.method !== 'number'){
    const err = new Error('method is NaN')
    err.status = 400
    throw err
  }
  method = Number(info.method)
  let data
  try{
    data= await Content.create({
      dataId,
      title1: null,
      title2: null,
      title3: null,
      title4: null,
      content: null,
      pageFrom: 1,
      pageTo: 1,
      aspect,
      keypoint,
      method,
      isChecked: 0,
      reviewerId: 0,
      isConflicted: 0,
      updateTime: Date.now(),
    })
  }
  catch(err){
    err = new Error('creating data failed')
    err.status = 500
    throw err
  }
  try{
    return await labelFromNumber(data)
  }
  catch(err){
    err = new Error('converting label from number failed')
    err.status = 500
    throw err
  }
}