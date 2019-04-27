import midLongTermDB from 'projectRoot/mid-long-term/models/operations/connect.js'
const Sequelize = require('sequelize')
import User from 'projectRoot/auth/models/schemas/user.js'

const dataSchema = {
  dataId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement:true,
  },
  campusId: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false
  },
  typeId: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false
  },
  yearFrom: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false
  },
  yearTo: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false
  }
}

const Data = midLongTermDB.define('data', dataSchema)

export default Data