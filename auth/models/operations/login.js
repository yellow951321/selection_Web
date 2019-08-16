import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'

export default async(info) =>{
  try{
    if(typeof info !== 'object'){
      let err = new Error('invalid argument')
      err.status = 400
      throw err
    }

    let data
    try{
      data = await User.findOne({
        where:{
          account: info.account,
          password: info.password,
        },
      })
    }catch(err){
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }
    if(data != null){
      info.expiration = Number(info.expiration)

      if(Number.isNaN(info.expiration)){
        let err = new Error('expiration is NaN')
        err.status = 400
        throw err
      }
      try{
        Session.create({
          sessionId: info.sessionId,
          expiration: info.expiration,
          userId: data.userId,
        })
      }catch(err){
        err = new Error('session create failed')
        err.status = 500
        throw err
      }
    }else{
      let err = new Error(`No account matched ${info.account}.`)
      err.status = 401
      throw err
    }
    return {
      userId : data.userId,
    }
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('login.js failed')
      err.status = 500
    }
    throw err
  }
}