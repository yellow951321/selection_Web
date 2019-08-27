/**
 * @file Create a new Campus into database given the following information
 */
import {Data, } from 'short-term/models/association.js'
/**
 * Create a new Campus into database given the following information
 * @function dataCreate
 * @param {object} info
 * @param {number} info.campusId - The ID of campus name
 * @param {number} info.typeId - The ID of the type(0 or 1)
 * @param {number} info.userId - The ID of the user
 * @param {number} info.year - The year
 * @returns {string} - return a OK to represent this op is work correctly
 * @thorows - Throw an error if the campusId | typeId | userId | year == isNan
 */
export default async(info) =>{
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }
  if(Number.isNaN(Number(info.campusId)) || typeof info.campusId !== 'number'){
    const err = new Error('campusId is NaN')
    err.status = 400
    throw err
  }
  info.campusId = Number(info.campusId)
  if(Number.isNaN(Number(info.typeId)) || typeof info.typeId !== 'number'){
    const err = new Error('typeId is NaN')
    err.status = 400
    throw err
  }
  info.typeId = Number(info.typeId)
  if(Number.isNaN(Number(info.userId)) || typeof info.userId !== 'number'){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }
  info.userId = Number(info.userId)
  if(Number.isNaN(Number(info.year)) || typeof info.year !== 'number'){
    const err = new Error('year is NaN')
    err.status = 400
    throw err
  }
  info.year = Number(info.year)

  let campus, result
  try{
    campus = await Data.findOne({
      where:{
        campusId: info.campusId,
        typeId: info.typeId,
        year: info.year,
      },
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  try{
    if(campus === null){
      result = await Data.create({
        campusId: info.campusId,
        typeId: info.typeId,
        userId: info.userId,
        year: info.year,
      })
    }
  }catch(err){
    err = new Error('creating data failed')
    err.status = 500
    throw err
  }
  return result
}