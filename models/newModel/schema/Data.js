const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const User = require('./User')
const dataSchema = {
  dataId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement:true,
  },
  campus:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  year:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  type:{
    type: Sequelize.INTEGER(10).UNSIGNED.ZEROFILL,
    allowNull: false,
  },
  userId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    references:{
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'userId',
    },
    allowNull: false,
  },
}

const Data = sequelize.define('data', dataSchema)

module.exports = Data