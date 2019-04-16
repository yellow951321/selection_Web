const Sequelize = require('sequelize')
const config = require('../config')

const sequelizeUser = new Sequelize(`${config.database[0].database}`, `${config.database[0].user}`, `${config.database[0].password}`, {
  // Custom host
  host: `${config.database[0].host}`,
  // Custom port
  port: config.database[0].port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: true,
  // a flag for using a native library or not
  //-default: false
  native: true,

  // remove logging
  logging: false,

  // Specify options, which are used when sequelize.defin is called.
  define:{
    underscored: true,
    charset: 'utf-8',
    freezeTableName: true,
    dialectOptions:{
      collate: 'utf8mb4_general_ci',
    },
    timestamps: false,
  },
  // String based operator alias, default value is true which will enable all operators alias
  // Pass object to limit set of aliased operators or false to disable completely
  operatorsAliases: false,
  // Similar for sync: you can define this to always force sync for models
  sync: { force: false, },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 30000,
  },
})


const sequelizeMidLongTerm = new Sequelize(`${config.database[1].database}`, `${config.database[1].user}`, `${config.database[1].password}`, {
  // Custom host
  host: `${config.database[1].host}`,
  // Custom port
  port: config.database[1].port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: true,
  // a flag for using a native library or not
  //-default: false
  native: true,

  // remove logging
  logging: false,

  // Specify options, which are used when sequelize.defin is called.
  define:{
    underscored: true,
    charset: 'utf-8',
    freezeTableName: true,
    dialectOptions:{
      collate: 'utf8mb4_general_ci',
    },
    timestamps: false,
  },
  // String based operator alias, default value is true which will enable all operators alias
  // Pass object to limit set of aliased operators or false to disable completely
  operatorsAliases: false,
  // Similar for sync: you can define this to always force sync for models
  sync: { force: false, },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 30000,
  },
})

const sequelizeShortTerm = new Sequelize(`${config.database[2].database}`, `${config.database[2].user}`, `${config.database[2].password}`, {
  // Custom host
  host: `${config.database[2].host}`,
  // Custom port
  port: config.database[2].port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: true,
  // a flag for using a native library or not
  //-default: false
  native: true,

  // remove logging
  logging: false,

  // Specify options, which are used when sequelize.defin is called.
  define:{
    underscored: true,
    charset: 'utf-8',
    freezeTableName: true,
    dialectOptions:{
      collate: 'utf8mb4_general_ci',
    },
    timestamps: false,
  },
  // String based operator alias, default value is true which will enable all operators alias
  // Pass object to limit set of aliased operators or false to disable completely
  operatorsAliases: false,
  // Similar for sync: you can define this to always force sync for models
  sync: { force: false, },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 30000,
  },
})

module.exports = {
  sequelizeUser,
  sequelizeMidLongTerm,
  sequelizeShortTerm
}