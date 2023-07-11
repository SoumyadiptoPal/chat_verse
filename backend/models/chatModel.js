const mongoose = require('mongoose');
const { Schema } = mongoose;
const ChatSchema = new Schema({
    chatName:{
        type: String,
        trim: true
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
  },
  {
    timestamps:true,
  });
  const Chat = mongoose.model('Chat', ChatSchema);
  module.exports = Chat;