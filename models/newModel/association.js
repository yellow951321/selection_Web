const User = require('./schema/User');
const Data= require('./schema/Data');
const Content= require('./schema/Content');

User.hasMany(Data, {
    as: 'data',
    foreignKey: 'userId',
    sourceKey: 'userId',
})

Data.hasMany(Content, {
    as: 'contents',
    foreignKey: 'dataId',
    sourceKey: 'dataId'
})

module.exports = {
    User,
    Data,
    Content
}

