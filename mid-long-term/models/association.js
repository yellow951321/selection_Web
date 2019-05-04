import User from 'projectRoot/auth/models/schemas/user.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'


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

