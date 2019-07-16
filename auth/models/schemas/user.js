/**
 * @file The schema of the user in sinica database.
 * @author F74064054 <s0913768710@gmail.com>
 * @copyright 2019 ncku csie IKM LAB
 */
import Sequelize from 'sequelize'
// import the UserDB Module
import UserDB from 'auth/models/operations/connect.js'

/**
 * @constant {Sequelize.Models} User
 * @implements {UserDB.define}
 * @type {Sequelize.Models}
 * @property {object} userId - The
 * @property {object} account
 * @property {object} password
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