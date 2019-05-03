import Sequelize from 'sequelize'

import localDB from 'projectRoot/local/models/operations/connect.local.js'

const Session = localDB.define('session', {
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