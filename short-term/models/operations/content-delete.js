import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'

export default async(info)=>{
  try{
    if(Number.isNaN(info.contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
    }
    try{
      Content.destroy({
        where:{
          contentId: info.contentId,
        },
      })
    }
    catch(err){
      err = new Error('content delete failed')
      err.status = 500
    }
  }
  catch(err){
    if(Number.isNaN(err.status)){
      err = new Error('content-delete.js failed')
      err.status = 500
    }
    throw err
  }
}