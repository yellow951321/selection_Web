var mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`,{
  useNewUrlParser: true
});

module.exports = {
  mongoose
};