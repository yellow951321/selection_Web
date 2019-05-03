import User from 'projectRoot/local/models/schemas/user.js'
import Data from 'projectRoot/local/models/schemas/Data.js'
import Content from 'projectRoot/local/models/schemas/Content.js'


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

