// const { sequelizeShortTerm, } = require(`${process.env.ROOT}/db/mariadb`)
import midLongTermDB from 'projectRoot/mid-long-term/models/operations/connect.js'
const Sequelize = require('sequelize')

// todo require('./Data)

const contentSchema = {
  contentId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unqiue: true,
    autoIncrement: true,
  },
  title1: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  title2: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  title3: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  title4: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  content: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  summary: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  note: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  pageFrom: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  pageTo: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    unqiue: true,
  },
  aspect: {
    type: Sequelize.TINYINT(8),
    allowNull: false,
  },
  keypoint: {
    type: Sequelize.TINYINT(8),
    allowNull: false,
  },
  method: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: false,
  },
  isChecked: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
  },
  reviewerId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: true,
  },
  isConflicted: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
  },
  conflictedAspect: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: true,
  },
  conflictedKeypoint: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: true,
  },
  conflictedMethod: {
    type: Sequelize.TINYINT(8).UNSIGNED,
    allowNull: true,
  },
  updateTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  dataId: {
    type: Sequelize.INTEGER(32).UNSIGNED,
    allowNull: false,
  },
}

const Content = midLongTermDB.define('content', contentSchema)

export default Content
