import Content from 'projectRoot/short-term/models/schemas/Content.js'

export default async(info)=>{
  try{

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    info.contentId = Number(info.contentId)

    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
    }
    let result
    try{
      result = await Content.destroy({
        where:{
          contentId: info.contentId,
        },
      })
    }
    catch(err){
      err = new Error('content delete failed')
      err.status = 500
    }
    return result
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('content-delete.js failed')
      err.status = 500
    }
    throw err
  }
}