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
export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  try{
    /**
     * Destroy the data in `Session` table.
     * @see {@link Session}
     */
    await Session.destroy({
      where: {
        sessionId: info.sessionId,
      },
    })
  }catch(err){
    /**
       * This might be a potential error
       * 1. The Unknow problem occurred when execute `Session.destroy` operation.
       */
    err = new Error('deleting session failed')
    err.status = 500
    throw err
  }
}