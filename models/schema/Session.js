const {sequelizeUser, } = require(`${process.env.ROOT}/db/mariadb`)
const Sequelize = require('sequelize')

const sessionSchema = {
  tableId :{
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
  expiration: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
  }
}

const Session = Sequelize.define('session', sessionSchema)

module.exports = Session