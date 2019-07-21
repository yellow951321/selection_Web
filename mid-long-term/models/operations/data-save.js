import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

export default async(info = {})=> {
  try{
    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
    }

    let content, data
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
    }
    catch(err){
      err = new Error('content fetch error')
      err.status = 500
      throw err
    }

    if(Number.isNaN(content.dataId)){
      let err = new Error('dataId is not a number')
      err.status = 400
    }

    // privillige check
    try{
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
      err = new Error('data fetch error')
      err.status = 500
      throw err
    }

    if(data === null){
      const err = new Error('data not found')
      err.status = 404
      throw err
    }

    if(data.userId !== Number(info.userId)){
      const err = new Error('Unauthorized')
      err.status = 401
      throw err
    }

    let savedContent = await content.update({
      content: info.content,
      summary: info.summary,
      note: info.note,
      reviewerId: info.reviewerId,
      title1: info.title1,
      title2: info.title2,
      title3: info.title3,
      title4: info.title4,
      pageFrom: info.pageFrom,
      pageTo: info.pageTo,
      contentId: info.contentId,
      isChecked: 0,
      isConflicted: 0,
      conflictedAspect: null,
      conflictedKeypoint: null,
      conflictedMethod: null,
    })

    return savedContent
  }
  catch(err){
    if(!err.status){
      err = new Error('save failed')
      err.status = 500
    }
    throw err
  }
}