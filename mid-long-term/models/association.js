import User from 'projectRoot/auth/models/schemas/user.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'


User.hasMany( Data , {
  as: 'data',
  foreignkey: 'userId',
  sourceKey: 'userId'
})

Data.hasMany( Content, {
  as: 'content',
  foreignkey: 'dataId',
  sourceKey: 'dataId'
})


export {
  User,
  Data,
  Content
}
