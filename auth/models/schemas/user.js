/**
 * @file The schema of the user in sinica database.
 */
import Sequelize from 'sequelize'
import UserDB from 'auth/models/operations/connect.js'

/**
 * @constant {Sequelize.Models} User
 * @implements {UserDB.define}
 * @type {Sequelize.Models}
 * @property {object} userId - The ID of the user
 * @property {object} account - The account of the user
 * @property {object} password - The password of the user
 */
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