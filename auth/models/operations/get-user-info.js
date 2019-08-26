/**
 * @file Define the OP which will get the user's information
 */
import User from 'auth/models/schemas/user.js'

/**
 * @typedef {object} infoObject
 * @property {string | number} userId
 */

/**
 * @function get-user-info
 * @param {infoObject} info
 * @returns {void}
 * @throws userId is NaN
 * @throws Data fetch failed
 */
export default async(info) => {
  /**
   * Check the `info.userId` is `number` or not.
   * If not, throw an error with status code, `400`
   */
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let userId
  /**
   * Find a data in `User` table with the given
   * `where` and `attributes` properties.
   */
  if(Number.isNaN(info.userId) || typeof info.userId !== 'number'){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }
  userId = Number(info.userId)

  let user
  try{
    user = await User.findOne({
      where:{
        userId,
      },
      attributes:[
        'account',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  return user
}