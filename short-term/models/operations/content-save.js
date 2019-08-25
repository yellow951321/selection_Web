import {Content, Data, } from 'short-term/models/association.js'

export default async(info)=> {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  if(typeof info.userId !== 'number' || Number.isNaN(info.userId)){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }

  if(typeof info.contentId !== 'number' || Number.isNaN(info.contentId)){
    const err = new Error('contentId is NaN')
    err.status = 400
    throw err
  }

  let savedData = {
    isChecked: 0,
    isConflicted: 0,
    conflictedAspect: null,
    conflictedKeypoint: null,
    conflictedMethod: null,
  }
  
  if(typeof info.title1 !== 'string' && typeof info.title1 !== 'undefined' && info.title1 !== null){
    const err = new Error('title1 is not valid')
    err.status = 400
    throw err
  }
  savedData.title1 = info.title1
  if(typeof info.title2 !== 'string' && typeof info.title2 !== 'undefined' && info.title2 !== null){
    const err = new Error('title2 is not valid')
    err.status = 400
    throw err
  }
  savedData.title2 = info.title2
  if(typeof info.title3 !== 'string' && typeof info.title3 !== 'undefined' && info.title3 !== null){
    const err = new Error('title3 is not valid')
    err.status = 400
    throw err
  }
  savedData.title3 = info.title3
  if(typeof info.title4 !== 'string' && typeof info.title4 !== 'undefined' && info.title4 !== null){
    const err = new Error('title4 is not valid')
    err.status = 400
    throw err
  }
  savedData.title4 = info.title4
  if(typeof info.content !== 'string' && typeof info.content !== 'undefined' && info.content !== null){
    const err = new Error('content is not valid')
    err.status = 400
    throw err
  }
  savedData.content = info.content
  if(typeof info.summary !== 'string' && typeof info.summary !== 'undefined' && info.summary !== null){
    const err = new Error('summary is not valid')
    err.status = 400
    throw err
  }
  savedData.summary = info.summary
  if(typeof info.note !== 'string' && typeof info.note !== 'undefined' && info.note !== null){
    const err = new Error('note is not valid')
    err.status = 400
    throw err
  }
  savedData.note = info.note
  if(info.pageFrom === undefined || (typeof info.pageFrom === 'number' && !Number.isNaN(info.pageFrom)))
    savedData.pageFrom = info.pageFrom
  else{
    const err = new Error('pageFrom is NaN')
    err.status = 400
    throw err
  }
  if(info.pageTo === undefined || (typeof info.pageTo === 'number' && !Number.isNaN(info.pageTo)))
    savedData.pageTo = info.pageTo
  else{
    const err = new Error('pageTo is NaN')
    err.status = 400
    throw err
  }
  
  let content, data, savedContent
  try{
    content = await Content.findOne({
      where:{
        contentId: info.contentId,
      },
      attributes: [
        'contentId',
        'dataId',
      ],
    })
    // privillige check
    data = await Data.findOne({
      where:{
        dataId: content.dataId,
      },
      attributes: [
        'userId',
      ],
    })
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('fetching data failed')
      err.status = 500
    }
    throw err
  }

  if(data === null){
    const err = new Error('data not found')
    err.status = 404
    throw err
  }

  if(data.userId !== Number(info.userId)){
    const err = new Error('Unauthorized')
    err.status = 405
    throw err
  }

  try{
    savedContent = await content.update(savedData)
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('updating data failed')
      err.status = 500
    }
    throw err
  }
  return savedContent
}