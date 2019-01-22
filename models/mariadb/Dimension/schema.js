const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const dimensionSchema = {
  dimension_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  dimension_name:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    unique: true
  },
  campus_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false
  }
}

// use for some setting but ignored
// const setting = {
//   // Need to set the timestamp to true
//   //when adding the timestamp attributes (updateAt, createdAt)
//   timestamps: true,

//   // CreateAt
//   createdAt: false,
//   // UpdateTimestamp to be called when updating
//   updateAt: 'updateTimestamp',

//   // DeleteAt to be called destroyTime (rember to enable paranoid for this to work)
//   deletedAt: 'destroyTime',
//   paranoid: true
// }

const User = sequelize.define('dimensions',dimensionSchema)

module.exports = User
