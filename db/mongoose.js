var mongoose = require('mongoose')
const config = require('./config')
const isDevMode = process.env.MODE == 'DEVELOPMENT'
const needAuth = process.env.AUTH = 'AUTHENTICATION'
mongoose.Promise = Promise

if (isDevMode && !needAuth)
  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`, {
    useNewUrlParser: true,
  })
else if(isDevMode && needAuth)
  mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`, {
    useNewUrlParser: true,
  })

module.exports = {
  mongoose,
}