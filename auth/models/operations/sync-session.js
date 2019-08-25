import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import cookieParser from 'cookie-parser'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let sessionId
  try{
    sessionId = cookieParser.signedCookies(info.cookies, config.server.secret)['sekiro']
  }
  catch(err){
    err = new Error('parsering cookie failed')
    err.status = 500
    throw err
  }
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
      err = new Error('fetching data failed')
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
            status: 200,
            message: 'sync success',
            userId: data.userId,
          }
        }
        else{
          await data.destroy()
          return {
            status: 440,
            message: 'session expired',
          }
        }
      }
    }catch(err){
      err = new Error('updating data failed')
      err.status = 500
      throw err
    }
  }
  return {
    status: 302,
    message: 'session is latest on the server',
  }
}