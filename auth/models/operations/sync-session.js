import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import cookieParser from 'cookie-parser'

export default async(info) => {
  try{
    let sessionId = cookieParser.signedCookies(info.cookies, config.server.secret)['sekiro']
    // sessionId will be reset after restarting server
    // we need to update session after every connection

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
        err = new Error('data fetch failed')
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
        err = new Error('data update or destroy failed')
        err.status = 500
        throw err
      }
    }
    return {
      message: 'do not have session on the server',
    }
  }catch(err) {
    if(typeof err.status !== 'number'){
      err = new Error('Failed in syncSession.')
      err.status = 500
    }
    throw err
  }
}