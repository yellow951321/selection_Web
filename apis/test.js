const User = require('../models/mariadb/User/schema')
const Year = require('../models/mariadb/Year/schema')

User.hasMany(Year)

User.findAll({
    include: [{

    }]
})


