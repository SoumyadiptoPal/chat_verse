const connectToMongo=require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/chat',require('./routes/chat'))
app.use('/api/message',require('./routes/message'))


const server=app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return;
    
    // console.log("chat.users not defined");

    // chat.users.forEach((user) => {
    //   if (user._id == newMessageRecieved.sender._id) return;
    //   console.log(user);
    //   socket.in(user._id).emit("message recieved", newMessageRecieved);
    // });
    io.emit('message recieved', newMessageRecieved);
  });
  
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

})
