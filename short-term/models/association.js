/**
 * Define a association relatioin betwoeen Data and Content
 */

 // import User Module
import User from 'projectRoot/auth/models/schemas/user.js'
// import Data Module
import Data from 'projectRoot/short-term/models/schemas/Data.js'
// import Content Module
import Content from 'projectRoot/short-term/models/schemas/Content.js'


// Define the Data which has many Content.
Data.hasMany(Content, {
  as: 'content',
  foreignKey: 'dataId',
  sourceKey: 'dataId',
})

/**
 * Export the User, Data, Content Module which the
 * module Data and Content have a hasmany relation.
 */
export {
  User,
  Data,
  Content,
}

