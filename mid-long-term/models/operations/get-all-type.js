import Data from 'mid-long-term/models/schemas/Data.js'


export default async(userId) => {
  try{
    // find all data with the given userId and year
    let data = await Data.findAll({
      attributes: ['typeId',],
      group: ['typeId',],
    })
    return data.map((data) => data.typeId)
  }
  catch(err){
    throw err
  }
}
