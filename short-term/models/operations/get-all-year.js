import Data from 'short-term/models/schemas/Data.js'

export default async() => {
  try{
    let data
    try{
      data = await Data.findAll({
        attributes: ['year', ],
        group: ['year', ],
      })
    }
    catch(err){
      err = new Error('data fetch failed.')
      err.status = 500
      throw err
    }
    let years = []
    data.map(data => {
      years.push(data.year)
    })
    return years
  }
  catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('Error occur in short-term/models/operations/get-all-year.js')
      err.status = 500
    }
    throw err 
  }
}
