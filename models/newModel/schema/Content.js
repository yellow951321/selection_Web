const sequelize = require('../../../db/mariadb')
const Sequelize = require('sequelize')
const Data = require('./Data')
const contentSchema = {
  contentId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement:true,
  },
  content:{
    type: Sequelize.STRING(1000),
  },
  title:{
    type: Sequelize.STRING(200),
    allowNull: false,
  },
  summary:{
    type: Sequelize.STRING(200),
  },
  pageStart:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  pageEnd:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  aspect:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  keypoint:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  method:{
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  dataId:{
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
  },
}

const Content = sequelize.define('contents', contentSchema)

module.exports = Content