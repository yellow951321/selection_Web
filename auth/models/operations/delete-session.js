import Session from 'auth/models/schemas/session.js'

export default async(info) => {
  try{
    try{
      await Session.destroy({
        where: {
          sessionId: info.sessionId,
        },
      })
    }catch(err){
      err = new Error('session deletion failed')
      err.status = 500
      throw err
    }
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('delete-session failed')
      err.status = 500
    }
    throw err
  }
}