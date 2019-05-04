import User from 'auth/models/schemas/user.js'


const authUser = async(req, res, next)=>{
  if(typeof(req.session.userId) !== 'undefined'){
    const data = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })
    if(data !== null){
      res.locals.user = data.account
    }
    next()
  }else{
    res.redirect('/auth/login')
  }
}



export default authUser