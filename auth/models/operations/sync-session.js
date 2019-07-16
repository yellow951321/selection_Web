/**
 * @file Check the session of the user
 */
/**
 * Import Module Session
 */
import Session from 'auth/models/schemas/session.js'


/**
 * Synchronize the session which is used in auth/app.js.
 * It will check the session of the user is exits or not.
 * If it is expired, then destroy the session of the user
 * in the database. Otherwirse, update the session in the
 * database
 * @func syncSession
 * @param {number} req - The request object of express
 * @param {number} sessionId - The sessionId parsed by cookieParser
 */
export default async(req, sessionId) => {
  try{
    // sessionId will be reset after restarting server
    // we need to update session after every connection
    if(sessionId !== req.session.id){
      const data = await Session.findOne({
        attribute: [
          'expiration',
          'userId',
        ],
        where: {
          sessionId,
        },
      })
      if(data !== null){
        if(Number(data.expiration) > Date.now()){
          req.session.userId = data.userId
          await data.update({
            sessionId: req.session.id,
          })
        }
        else{
          await data.destroy()
        }
      }
    }
  }catch(err) {
    if(err.status)
      throw err
    else {
      err = new Error('Failed in syncSession.')
      err.status = 500
      throw err
    }
  }
}