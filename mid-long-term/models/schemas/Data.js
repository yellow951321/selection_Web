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
    // references: {
    //   // This is a reference to another model
    //   model: User,
    //   // This is the column name of the referenced model
    //   key: 'userId'
    // },
    allowNull: false
  }
}

const Data = midLongTermDB.define('data', dataSchema)

export default Data