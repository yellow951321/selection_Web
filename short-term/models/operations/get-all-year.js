import {Data, } from 'short-term/models/association.js'

export default async() => {
  let data
  try{
    data = await Data.findAll({
      attributes: ['year', ],
      group: ['year', ],
    })
  }
  catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }
  let years = []
  data.map(data => {
    years.push(data.year)
  })
  return years
}
