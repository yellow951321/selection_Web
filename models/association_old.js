const User = require('./schema_old/User')
const Data= require('./schema_old/Data')
const Content= require('./schema_old/Content')

User.hasMany(Data, {
  as: 'data',
  foreignKey: 'userId',
  sourceKey: 'userId',
})

Data.hasMany(Content, {
  as: 'contents',
  foreignKey: 'dataId',
  sourceKey: 'dataId',
})

module.exports = {
  User,
  Data,
  Content,
}

