import Session from 'auth/models/schemas/session.js'

export default async(req) => {
  try{
    try{
      await Session.destroy({
        where: {
          sessionId: req.session.id,
        },
      })
    }catch(err){
      err = new Error('session deletion failed')
      err.status = 500
      throw err
    }
    req.session.destroy()
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('delete-session failed')
      err.status = 500
    }
    throw err
  }
}