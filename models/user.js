const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
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
});


var User = mongoose.model('User',userSchema);

module.exports={
  User
};