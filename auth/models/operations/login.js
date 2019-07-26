import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'

export default async(req) =>{
  try{
    let data
    try{
      data = await User.findOne({
        where:{
          account: req.body.username,
          password: req.body.password,
        },
      })
    }catch(err){
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }
    if(data != null){
      req.session.userId = data.userId

      try{
        Session.create({
          sessionId: req.session.id,
          expiration: Number(req.session.cookie.expires),
          userId: data.userId,
        })       
      }catch(err){
        err = new Error('session create failed')
        err.status = 500
        throw err
      }
    }else{
      let err = new Error(`No account matched ${req.body.username}.`)
      err.status = 401
      throw err
    }
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('login.js failed')
      err.status = 500
    }
    throw err
  }
}