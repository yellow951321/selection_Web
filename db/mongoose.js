var mongoose = require('mongoose')
const config = require('./../config')
const isDevMode = process.env.MODE == 'DEVELOPMENT'
const needAuth = false
mongoose.Promise = Promise

if (isDevMode && !needAuth){
  console.log('non auth mode')
  mongoose.connect(`mongodb://${config.database.host}/${config.database.name}`, {
    useNewUrlParser: true,
  })
}
else if(isDevMode && needAuth){
  console.log('need auth mode')
  mongoose.connect(`mongodb://${config.database.user}:${config.database.password}@${config.database.host}/${config.database.name}`, {
    useNewUrlParser: true,
  })
}


module.exports = {
  mongoose,
}