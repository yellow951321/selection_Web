import Content from 'projectRoot/short-term/models/schemas/Content.js'
export default async(contentId, updatedData) => {
  try{
    let data = await Content.findOne({
      where:{
        contentId,
      },
      attributes:[
        'contentId',
        'isChecked',
      ],
    })
        
    let newData = await data.update(updatedData)
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