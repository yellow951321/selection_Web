const Sequelize = require('sequelize')
const config = require('./config')
const sequelize = new Sequelize(`${config.database.database}`, `${config.database.user}`, `${config.database.password}`, {
  // Custom host
  host: `${config.database.host}`,
  // Custom port
  port: config.database.port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: true,
  // a flag for using a native library or not
  //-default: false
  native: true,

  // Specify options, which are used when sequelize.defin is called.
  define:{
    underscored: true,
    charset: 'utf-8',
    freezeTableName: false,
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
    idle: 10000,
  },
})

module.exports = sequelize