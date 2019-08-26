import {Data, } from 'mid-long-term/models/association.js'
import typeMap from 'lib/static/javascripts/mapping/campus.js'

/**
 * @typedef {object} typeInfo
 * @property {string} name
 * @property {number} id
 */

/**
 * Return all kinds of type, `大學`, `技專院校`
 * @function getAllType
 * @returns {typeInfo[]}
 * @throws - throw two errors
 * 1. `fetching data failed`
 * 2. `data formatting failed`
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
