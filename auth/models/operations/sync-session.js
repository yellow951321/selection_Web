import Session from 'auth/models/schemas/session.js'
import { nextTick, } from 'q'

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
      next(err)
    else {
      err = new Error('Failed in syncSession.')
      err.status = 500
      next(err)
    }
  }
}