/**
 * @file The Session schema of the session table in the database
 */
// import the Sequelize module
import Sequelize from 'sequelize'
// import the connection object to the database server
import UserDB from 'auth/models/operations/connect.js'

/**
 * @constant {Sequelize.Model} Session
 * @property {object} tableId - The
 * @property {object} sessionId
 * @property {object} expiration
 * @property {object} userId
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