import User from 'auth/models/schemas/user.js'

export default async(info) => {
  try{
    info.userId = Number(info.userId)
        
    if(Number.isNaN(info.userId)){
      let err = new Error('userId is NaN')
      err.status = 400
      throw err
    }

    let user
    try{
      user = await User.findOne({
        where:{
          userId: info.userId,
        },
        attributes:[
          'account',
        ],
      })
    }catch(err){
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }

    return user
  }catch(err){
    if(typeof err.status !== 'number'){
      err = new Error('data fetch failed')
      err.status = 500
    }
    throw err
  }
}