/**
 * @file Check the session of the user
 */
import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import cookieParser from 'cookie-parser'


/**
 * @function sync-session
 * @param {object} info - It is a request object
 * @returns {void}
 * @throws Data fetch failed
 * @throws Data update or destroy failed
 * @throws Failed in syncSession
 * @example
 * // if it execute well, return `void`
 * syncSession(info)
 */
export default async(info) => {
  try{
    /**
     * `sessionId` will be reset after restarting server,
     * we need to update the session after every connection
     */
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']

    if(sessionId !== info.sessionId){
      let data
      try{
        data = await Session.findOne({
          attribute: [
            'expiration',
            'userId',
          ],
          where: {
            sessionId,
          },
        })
      }catch(err){
       /**
       * It only catch the error when
       * it occurs exception in executing `Session.findOne`
       */
        err = new Error('Data fetch failed')
        err.status = 500
        throw err
      }
      try{
        if(data !== null){
          if(Number(data.expiration) > Date.now()){
            await data.update({
              sessionId: info.sessionId,
            })
            return {
              message: 'sync success',
              userId: data.userId,
            }
          }
          else{
            await data.destroy()
            return {
              message: 'session expired',
            }
          }
        }
      }catch(err){
        /**
       * It only catch the error when
       * it occurs exception in executing `data.update`
       */
        err = new Error('Data update or destroy failed')
        err.status = 500
        throw err
      }
    }
    return {
      message: 'do not have session on the server',
    }
  }catch(err) {
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err = new Error('Failed in syncSession.')
      err.status = 500
    }
    throw err
  }
}