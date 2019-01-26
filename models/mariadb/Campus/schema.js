const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const Year = require('../Year/schema')
const campusSchema = {
  campus_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  campus_name:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    unique: true,
  },
  campus_type:{
    type: Sequelize.TINYINT(1).UNSIGNED.ZEROFILL,
    allowNull: false,
  },
  year_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    references:{
      // This is a reference to another model
      model: Year,

      // This is the column name of the referenced model
      key: 'year_id',
    },
    allowNull: false,
  },
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

const Campus = sequelize.define('campuses', campusSchema)

module.exports = Campus
