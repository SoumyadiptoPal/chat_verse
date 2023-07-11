const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    
    password:{
        type: String,
        required: true
    },
    pic:{
        type:String,
        required: true,
        default:'images/profile.jpg'
    }
  },{
    timestamps:true
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;