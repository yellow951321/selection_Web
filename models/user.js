const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports=User