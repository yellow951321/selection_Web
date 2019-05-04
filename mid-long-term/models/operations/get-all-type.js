import Data from 'mid-long-term/models/schemas/Data.js'
import typeMap from 'lib/static/javascripts/mapping/campus.js'

export default async() => {
  try{
    // find all data with the given userId and year
    let data = await Data.findAll({
      attributes: ['typeId', ],
      group: ['typeId', ],
    })
    return data.map(d => {
      return {
        name: typeMap[d.typeId].type,
        id: d.typeId,
      }
    })

  }
  catch(err){
    throw new Error('Error occur in get-all-type.js', err)
  }
}
