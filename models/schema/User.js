const { sequelizeUser ,} = require(`${process.env.ROOT}/db/mariadb`)
const Sequelize = require('sequelize')

const userSchema = {
  userId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    primarKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  account: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(20),
    allowNull: false,
  }
}


const User = sequelizeUser.define('user', userSchema)

module.exports = User