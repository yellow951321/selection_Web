/**
 * @file Define the OP which handles the logic when the users log in.
 */
import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'


/**
 * @function login
 * @param {object} req - A Express request object
 * @returns {void}
 * @throws Data fetch failed
 * @throws Session create failed
 * @throws No matched account
 * @throws login.js failed
 */
export default async(req) =>{
  try{
    if(typeof info !== 'object'){
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
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }
    if(data != null){
      info.expiration = Number(info.expiration)

      if(Number.isNaN(info.expiration)){
        let err = new Error('expiration is NaN')
        err.status = 400
        throw err
      }
      try{
        /**
         * Create a new session to the user of this request.
         * It will save the `hash id`, `expiration` and `userId`
         */
        Session.create({
          sessionId: info.sessionId,
          expiration: info.expiration,
          userId: data.userId,
        })
      }catch(err){
        /**
         * Catch the error when it occurred in `Session.create`
         */
        err = new Error('session create failed')
        err.status = 500
        throw err
      }
    }else{
      /**
       * Throw the error when there is no mathced account with
       * the not found status code, `401`
       */
      let err = new Error(`No account matched ${info.account}.`)
      err.status = 401
      throw err
    }
    return {
      userId : data.userId,
    }
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     * Finally, throw out the error.
     */
    if(typeof err.status !== 'number'){
      err = new Error('login.js failed')
      err.status = 500
    }
    throw err
  }
}