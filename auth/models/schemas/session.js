/**
 * @file The Session schema of the session table in the database
 */
import Sequelize from 'sequelize'
import UserDB from 'auth/models/operations/connect.js'

/**
 * @constant {Sequelize.Model} Session
 * @kind class
 * @property {object} tableId - The index of the table in `Session` table
 * @property {object} sessionId - The ID of the session
 * @property {object} expiration - The expiration time
 * @property {object} userId - The ID of the user
 */
const Session = UserDB.define('session', {
  tableId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  },
  sessionId: {
    type: Sequelize.STRING(45),
    allowNull: false,
    unique: true,
  },
  expiration:{
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  userId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
  },
})
export default Session