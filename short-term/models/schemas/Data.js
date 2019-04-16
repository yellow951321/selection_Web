const { sequelizeShortTerm, } = require(`${process.env.ROOT}/db/mariadb`)
const Sequelize = require('sequelize')
const User = requrie('./User')

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
  year: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'userId'
    },
    allowNull: false
  }
}

const Data = sequelizeShortTerm.define('data', dataSchema)

module.exports = Data