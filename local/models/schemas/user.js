import Sequelize from 'sequelize'

import localDB from 'projectRoot/local/models/operations/connect.local.js'


const User = localDB.define('user', {
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