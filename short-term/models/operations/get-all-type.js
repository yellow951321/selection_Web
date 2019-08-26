import {Data, } from 'short-term/models/association.js'
import typeMap from 'lib/static/javascripts/mapping/campus.js'

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
export default async() => {
  let data
  try{
    // find all data with the given userId and year
    data = await Data.findAll({
      attributes: ['typeId', ],
      group: ['typeId', ],
    })
  }
  catch(err){
    err = new Error('fetching data failed')
    err. status = 500
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
    err= new Error('data formatting failed')
    err.status = 500
    throw err
  }
}
