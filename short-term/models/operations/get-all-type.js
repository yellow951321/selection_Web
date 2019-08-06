import Data from 'short-term/models/schemas/Data.js'
import typeMap from 'lib/static/javascripts/mapping/campus.js'

export default async() => {
  let data
  try{
    // find all data with the given userId and year
    data = await Data.findAll({
      attributes: ['typeId', ],
      group: ['typeId', ],
    })
  }catch(err){
    err = new Error('data fetch error')
    err.status = 500
    throw err
  }

  try{
    return data.map(d => {
      return {
        name: typeMap[d.typeId].type,
        id: d.typeId,
      }
    })
  }
  catch(err){
    err = new Error('Error occur in short-term/models/operations/get-all-type.js')
    err.status = 500
    throw err
  }
}
