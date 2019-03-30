import Sequelize from 'sequelize'

import UserDB from 'auth/models/operations/connect.js'

const User = UserDB.define('user', {
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
})

export default User