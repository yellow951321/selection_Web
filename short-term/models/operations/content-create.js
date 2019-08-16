import Content from 'projectRoot/short-term/models/schemas/Content.js'
import labelFromNumber from 'projectRoot/short-term/models/operations/label-from-number.js'

export default async(info) => {

  try{

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.dataId = Number(info.dataId)
    info.aspect = Number(info.aspect)
    info.keypoint = Number(info.keypoint)
    info.method = Number(info.method)

    if(Number.isNaN(info.dataId)){
      const err = new Error('dataId is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.aspect)){
      const err = new Error('aspect is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.keypoint)){
      const err = new Error('keypoint is NaN')
      err.status = 400
      throw err
    }
    if(Number.isNaN(info.method)){
      const err = new Error('method is NaN')
      err.status = 400
      throw err
    }
    let data
    try{
      data= await Content.create({
        dataId: info.dataId,
        title1: null,
        title2: null,
        title3: null,
        title4: null,
        content: null,
        pageFrom: 1,
        pageTo: 1,
        aspect: info.aspect,
        keypoint: info.keypoint,
        method: info.method,
        isChecked: 0,
        reviewerId: 0,
        isConflicted: 0,
        updateTime: Date.now(),
      })
    }
    catch(err){
      err = new Error('data create failed')
      err.status = 500
      throw err
    }
    return await labelFromNumber(data)
  }catch(err){
    if(!err.status){
      err = new Error('content-create failed')
      err.status = 500
    }
    throw err
  }
}