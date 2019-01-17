var mongoose = require('mongoose')
const config = require('./config')
const isDevMode = process.env.MODE == 'DEVELOPMENT'
mongoose.Promise = Promise

if (isDevMode)
  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`, {
    useNewUrlParser: true,
  })
else
  mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`, {
    useNewUrlParser: true,
  })

module.exports = {
  mongoose,
}