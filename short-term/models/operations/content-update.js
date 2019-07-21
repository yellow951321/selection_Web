import Content from 'projectRoot/short-term/models/schemas/Content.js'
export default async(contentId, updatedData) => {
  try{
    if(Number.isNaN(contentId)){
      let err = new Error('contentId is not a number')
      err.status = 400
      throw err
    }
    let data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
        'isChecked',
      ],
    })
      .catch(()=>{
        let err = new Error('content fetch failed')
        err.status = 400
        throw err
      })

    let newData = await data.update(updatedData)
      .catch(()=>{
        let err = new Error('data update failed')
        err.status = 400
        throw err
      })
    return newData
  }
  catch(err){
    if(!err.status){
      let err = new Error('update data failed')
      err.status = 500
      throw err
    }
  }
}