const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const User = require('../User/schema')
const yearSchema = {
  year_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement:true
  },
  year:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  user_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    references:{
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'user_id'
    },
    allowNull: false,
  }
}

const Year = sequelize.define('years',yearSchema)

module.exports = Year