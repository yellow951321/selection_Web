import Sequelize from 'sequelize'

import UserDB from 'auth/models/operations/connect.js'

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