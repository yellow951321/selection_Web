import User from 'auth/models/schemas/user.js'

export default async(info) => {
  if(typeof info !== 'object' || info === null){
    let err = new Error('invalid argument')
    err.status = 400
    throw err
  }

  let userId
  if(Number.isNaN(info.userId) || typeof info.userId !== 'number'){
    const err = new Error('userId is NaN')
    err.status = 400
    throw err
  }
  userId = Number(info.userId)

  let user
  try{
    user = await User.findOne({
      where:{
        userId,
      },
      attributes:[
        'account',
      ],
    })
  }catch(err){
    err = new Error('fetching data failed')
    err.status = 500
    throw err
  }

  return user
}