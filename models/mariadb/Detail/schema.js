const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const Item = require('../Item/schema')

const detailSchema = {
  detail_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  detail_name:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    unique: true
  },
  item_id:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    references:{
      // This is a reference to another model
      model: Item,

      // This is the column name of the referenced model
      key: 'item_id'
    },
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

const Detail = sequelize.define('details',detailSchema)

module.exports = Detail