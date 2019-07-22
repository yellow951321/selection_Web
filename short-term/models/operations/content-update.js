import Content from 'projectRoot/short-term/models/schemas/Content.js'
export default async(contentId, updatedData) => {
  try{

    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    contentId = Number(contentId)

    if(Number.isNaN(contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
      throw err
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
  }
}