const sequelize = require('../../db/mariadb')
const Sequelize = require('sequelize')
const userSchema = {
  userId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  },
  account:{
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
  },
  password:{
    type: Sequelize.STRING(20),
    allowNull: false,
  },
}

const User = sequelize.define('users', userSchema)

module.exports = User