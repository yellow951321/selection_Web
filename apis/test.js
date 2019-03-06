const User = require('../models/mariadb/User/schema')
const Year = require('../models/mariadb/Year/schema')
const Sequelize = require('sequelize')

User.hasMany(Year, {
    as: 'years',
    foreignKey: 'user_id',
    sourceKey: 'user_id'
})

const test1 = User.findAll({
    include: [{
        model: Year,
        as: 'years',
        attributes: [
            'year_id',
        ],
        where: {
            user_id: Sequelize.col('users.user_id')
        },
    }]
})

module.exports = test1