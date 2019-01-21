const mongoose = require('mongoose')
const fs = require('fs')
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true,
  },
  id: {
    type: String,
    require: true,
    trim: 30,
  },
})


const User = mongoose.model('User', userSchema)

module.exports = User