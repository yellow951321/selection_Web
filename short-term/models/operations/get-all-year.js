import {Data, } from 'short-term/models/association.js'

/**
 * @typedef {object} campusYearInfo
 * @property {number} year
 */
/**
 * Return all year data
 * @function getAllYear
 * @returns {campusYearInfo[]}
 * @throws - throw a new Error if it occurred a unknown error
 */

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
