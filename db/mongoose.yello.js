var mongoose = require('mongoose')
const config = require('./config.yello')
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`, {
  useNewUrlParser: true
})

module.exports = {
  mongoose
}