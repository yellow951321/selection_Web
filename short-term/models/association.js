import User from 'projectRoot/auth/models/schemas/user.js'
import Data from 'projectRoot/short-term/models/schemas/Data.js'
import Content from 'projectRoot/short-term/models/schemas/Content.js'


Data.hasMany(Content, {
  as: 'content',
  foreignKey: 'dataId',
  sourceKey: 'dataId',
})


export {
  User,
  Data,
  Content,
}

