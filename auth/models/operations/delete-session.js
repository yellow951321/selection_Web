/**
 * @file A OP which define the logic of delete the session in database including error handling
 */
import Session from 'auth/models/schemas/session.js'

/**
 * @function delete-session
 * @param {object} req - A Express request object
 * @returns {void}
 * @throws Session deletion failed
 * @throws delete-session failed
 */
export default async(req) => {
  try{
    try{
      /**
       * Destroy the data in `Session` table.
       * @see {@link Session}
       */
      await Session.destroy({
        where: {
          sessionId: req.session.id,
        },
      })
    }catch(err){
      /**
       * This might be a potential error
       * 1. The Unknow problem occurred when execute `Session.destroy` operation.
       */
      err = new Error('session deletion failed')
      err.status = 500
      throw err
    }
    /**
     * Also, destroy the session in `req` object
     */
    req.session.destroy()
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err = new Error('delete-session failed')
      err.status = 500
    }
    throw err
  }
}