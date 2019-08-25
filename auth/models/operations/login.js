import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'

export default async(info) =>{
  if(typeof info !== 'object' || info === null){
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
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  try{
    if(data !== null){
      let expiration
      if(Number.isNaN(info.expiration) || typeof info.expiration !== 'number'){
        const err = new Error('expiration is NaN')
        err.status = 400
        throw err
      }
      expiration = Number(info.expiration)
      Session.create({
        sessionId: info.sessionId,
        expiration,
        userId: data.userId,
      })
    }
    else{
      let err = new Error(`No account matched ${info.account}.`)
      err.status = 401
      throw err
    }
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('creating session failed')
      err.status = 500
    }
    throw err
  }
  return {
    userId : data.userId,
  }
}