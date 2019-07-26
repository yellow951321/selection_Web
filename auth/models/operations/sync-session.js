import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import cookieParser from 'cookie-parser'

export default async(req) => {
  try{
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']
    // sessionId will be reset after restarting server
    // we need to update session after every connection

    if(sessionId !== req.session.id){
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
            req.session.userId = data.userId
            await data.update({
              sessionId: req.session.id,
            })
          }
          else{
            await data.destroy()
          }
        }
      }catch(err){
        err = new Error('data update or destroy failed')
        err.status = 500
        throw err
      }
    }
  }catch(err) {
    if(typeof err.status !== 'number'){
      err = new Error('Failed in syncSession.')
      err.status = 500
    }
    throw err
  }
}