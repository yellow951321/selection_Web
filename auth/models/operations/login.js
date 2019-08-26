/**
 * @file Define the OP which handles the logic when the users log in.
 */
import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'


/**
 * @function login
 * @param {object} info - A Express request object
 * @returns {void}
 * @throws Data fetch failed
 * @throws Session create failed
 * @throws No matched account
 * @throws login.js failed
 */
export default async(info) =>{
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let data
  try{
    /**
     * Find the user's information with the given properties, `username` and `password`
     */
    data = await User.findOne({
      where:{
        account: info.account,
        password: info.password,
      },
    })
  }catch(err){
    /**
     * Catch the error when it occurred when executing `User.fineOne`
     */
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  try{
    if(data !== null){
      let expiration
      if(Number.isNaN(info.expiration) || typeof info.expiration !== 'number'){
        const err = new Error('expiration is NaN')
        err.status = 400
        throw err
      }
      expiration = Number(info.expiration)
      /**
       * Create a new session to the user of this request.
       * It will save the `hash id`, `expiration` and `userId`
       */
      Session.create({
        sessionId: info.sessionId,
        expiration,
        userId: data.userId,
      })
    }
    else{
      let err = new Error(`No account matched ${info.account}.`)
      err.status = 401
      throw err
    }
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     * Finally, throw out the error.
     */
    if(typeof err.status !== 'number'){
      err = new Error('creating session failed')
      err.status = 500
    }
    throw err
  }
  return {
    userId : data.userId,
  }
}