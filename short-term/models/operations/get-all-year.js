import Data from 'short-term/models/schemas/Data.js'

export default async() => {
  try{
    // find all data with the given userId and year
    let data = await Data.findAll({
      attributes: ['year', ],
      group: ['year', ],
    })

    return data.map(d => {
      return {
        year: d.year,
      }
    })
  }
  catch(err){
    throw new Error('Error occur in short-term/models/operations/get-all-year.js')
  }
}
