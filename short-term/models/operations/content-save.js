/**
 * @file update a content with the given `userId`, `contentId`.
 */
import Content from 'projectRoot/short-term/models/schemas/Content.js'
import Data from 'projectRoot/short-term/models/schemas/Data.js'

/**
 * @typedef infoObject info
 * @property {number} contentId
 * @property {number} userId
 * @property {number} pageFrom
 * @property {nummber} pageTo
 * @property {string} title1
 * @property {string} title2
 * @property {string} title3
 * @property {string} title4
 * @property {string} content
 * @property {string} summary
 * @property {string} note
 * @property {number} reviewerId
 */

/**
 * update a content with the given `userId`, `contentId`.
 * @function content-save
 * @param {infoObject} info
 * @returns {array}
 * @throws invalide argument
 * @throws `contentId`is `NaN`
 * @throws `pageFrom` is `NaN`
 * @throws `pageTo` is `NaN`
 * @throws data fetch failed
 */

export default async(info)=> {
  try{

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    let content, data, savedContent
    info.userId = Number(info.userId)
    info.contentId = Number(info.contentId)
    info.pageFrom = Number(info.pageFrom)
    info.pageTo = Number(info.pageTo)

    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is NaN')
      err.status = 400
      throw err
    }

    if(Number.isNaN(info.pageFrom)){
      let err = new Error('start page is NaN')
      err.status = 400
      throw err
    }

    if(Number.isNaN(info.pageTo)){
      let err = new Error('end page is NaN')
      err.status = 400
      throw err
    }

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
        err = new Error('data fetch failed')
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
      const err = new Error('Method not allowed')
      err.status = 405
      throw err
    }

    try{
      savedContent = await content.update({
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
    }
    catch(err){
      if(typeof err.status !== 'number'){
        err = new Error('content fetch failed')
        err.status = 500
      }
      throw err
    }
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