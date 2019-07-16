/**
 * @typedef {object} campusTypeInfo
 * @property {string} name
 * @property {number} id
 */
/**
 * Return a array of object with property name and id
 * @function getAllType
 * @returns {campusTypeInfo}
 * @throws - It will throw an error message
 */
// import the Data module
import Data from 'short-term/models/schemas/Data.js'
// import hte typeMap module
import typeMap from 'lib/static/javascripts/mapping/campus.js'


export default async() => {
  try{
    // find all data with the given userId and year
    let data = await Data.findAll({
      attributes: ['typeId', ],
      group: ['typeId', ],
    })
    /*
    a array which rearrange each element into a object with properties name and id
    [
    {
      name: {string}
      id: {number}
    },
    ...]
    */
    return data.map(d => {
      return {
        name: typeMap[d.typeId].type,
        id: d.typeId,
      }
    })
  }
  catch(err){
    // error handling
    throw new Error('Error occur in short-term/models/operations/get-all-type.js')
  }
}
