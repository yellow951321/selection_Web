import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
export default async(contentId, updatedData) => {
  try{
    if(typeof updatedData !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    if(Number.isNaN(Number(contentId)) || typeof contentId !== 'number'){
      const err = new Error('contentId is NaN')
      err.status = 400
      throw err
    }
    contentId = Number(contentId)
    if(updatedData.reviewerId !== undefined){
      if(Number.isNaN(Number(updatedData.reviewerId)) || typeof updatedData.reviewerId !== 'number'){
        const err = new Error('reviewerId is NaN')
        err.status = 400
        throw err
      }
      updatedData.reviewerId = Number(updatedData.reviewerId)
    }
    if(updatedData.conflictedAspect !== undefined){
      if(Number.isNaN(Number(updatedData.conflictedAspect)) || typeof updatedData.conflictedAspect !== 'number'){
        const err = new Error('conflictedAspect is NaN')
        err.status = 400
        throw err
      }
      updatedData.conflictedAspect = Number(updatedData.conflictedAspect)
    } 
    if(updatedData.conflictedKeypoint !== undefined){
      if(Number.isNaN(Number(updatedData.conflictedKeypoint)) || typeof updatedData.conflictedKeypoint !== 'number'){
        const err = new Error('conflictedKeypoint is NaN')
        err.status = 400
        throw err
      }
      updatedData.conflictedKeypoint = Number(updatedData.conflictedKeypoint)
    }
    if(updatedData.conflictedMethod !== undefined){
      if(Number.isNaN(Number(updatedData.conflictedMethod)) || typeof updatedData.conflictedMethod !== 'number'){
        const err = new Error('conflictedMethod is NaN')
        err.status = 400
        throw err
      }
      updatedData.conflictedMethod = Number(updatedData.conflictedMethod)
    }
    if(updatedData.isConflicted !== undefined){
      updatedData.isConflicted = Number(updatedData.isConflicted)
      if(updatedData.isConflicted === 1 || updatedData.isConflicted === -1 || updatedData.isConflicted === 0){
        let err = new Error('isConflicted is not a valid argument')
        err.status = 400
        throw err
      }
    }
    if(updatedData.isChecked !== undefined){
      updatedData.isChecked = Number(updatedData.isChecked)
      if(updatedData.isChecked === 1 || updatedData.isChecked === -1 || updatedData.isChecked === 0){
        let err = new Error('isChecked is not a valid argument')
        err.status = 400
        throw err
      }
    }

    let data, newData
    try{
      data = await Content.findOne({
        where:{
          contentId,
        },
        attributes:[
          'contentId',
          'isChecked',
        ],
      })
      newData = await data.update(updatedData)
    }catch(err){
      err = new Error('update data failed')
      err.status = 500
      throw err
    }
    return newData
  }
  catch(err){
    if(!err.status){
      err = new Error('content-update failed')
      err.status = 500
      throw err
    }
    throw err
  }
}