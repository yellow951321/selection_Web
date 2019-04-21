const Sequelize = require('sequelize')

import db from 'projectRoot/models/schema_old/mariadb.js'

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

const User = db.define('users', userSchema)
export default User