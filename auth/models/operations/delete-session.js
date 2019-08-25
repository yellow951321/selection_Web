import Session from 'auth/models/schemas/session.js'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  try{
    await Session.destroy({
      where: {
        sessionId: info.sessionId,
      },
    })
  }catch(err){
    err = new Error('deleting session failed')
    err.status = 500
    throw err
  }
}