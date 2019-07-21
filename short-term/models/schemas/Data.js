/**
 * @module Data
 * @type {Sequelize.model}
 * @requires 'projectRoot/short-term/models/operations/connect.js'
 * @requires sequelize
 * @requires 'projectRoot/auth/models/schemas/user.js'
 * @see http://docs.sequelizejs.com/
 */
// import shortTermDB module
import shortTermDB from 'projectRoot/short-term/models/operations/connect.js'
// import the seqeulize module
const Sequelize = require('sequelize')
// import User module
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
    allowNull: false,
  },
  typeId: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false,
  },
  year: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    // references: {
    //   // This is a reference to another model
    //   model: User,
    //   // This is the column name of the referenced model
    //   key: 'userId',
    // },
    allowNull: false,
  },
}
/**
 * @const {Sequelize.model} Data
 */
const Data = shortTermDB.define('data', dataSchema)

export default Data