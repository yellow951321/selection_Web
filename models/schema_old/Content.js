const Sequelize = require('sequelize')

import db from 'projectRoot/models/schema_old/mariadb.js'

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

const Content = db.define('contents', contentSchema)

export default Content