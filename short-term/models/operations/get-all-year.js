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
// import the Data module
import Data from 'short-term/models/schemas/Data.js'

export default async() => {
  try{
    // find all data with the given userId and year
    let data = await Data.findAll({
      attributes: ['year', ],
      group: ['year', ],
    })
    /**
     * Return the campusYearInfo of array
     * campusYearInfo = { year }
     */
    return data.map(d => {
      return {
        year: d.year,
      }
    })
  }
  catch(err){
    // error handling
    throw new Error('Error occur in short-term/models/operations/get-all-year.js')
  }
}
