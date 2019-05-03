const UserShortTerm = require('./schema/shortTerm/User')
const DataShortTerm = require('./shema/shortTerm/Data')
const ContentShortTerm = require('./schema/shortTerm/Content')

// ShortTerm section

UserShortTerm.hasMany(DataShortTerm, {
  as: 'data',
  foreignkey: 'userId',
  sourceKey: 'userId',
})

DataShortTerm.hasMany(ContentShortTerm, {
  as: 'content',
  foreignkey: 'dataId',
  sourceKey: 'dataId'
})



module.exports = {
  UserShortTerm,
  DataShortTerm,
  ContentShortTerm
}