// import sequelize module
import Sequelize from 'sequelize'
// import config
import config from 'projectRoot/config.js'

export default new Sequelize('sinicaShortTerm', `${config.database.user}`, `${config.database.password}`, {
  // Custom host
  host: `${config.database.host}`,
  // Custom port
  port: config.database.port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: false,
  // a flag for using a native library or not
  //-default: false
  native: true,

  // remove logging
  logging: false,

  // Specify options, which are used when sequelize.define is called.
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
    acquire: 1000000,
    idle: 200000,
  },
})

