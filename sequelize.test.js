const User = require('./models/mariadb/User/schema')
const Sequelize = require('sequelize')
const {Op} = Sequelize

User.findAndCountAll({
  where:{
    user_name:{
      [Op.like] : '123456'
    }
  }
})
.then(result =>{
  console.log(result.count)
  console.log(result.rows[0].dataValues)
})