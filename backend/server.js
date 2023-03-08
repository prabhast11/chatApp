const express = require("express");
require("dotenv").config();
const chats = require("./data/data.js");
var cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


connectDB();

const app = express();
app.use(cors());

// to accept json data from frontend
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
  console.log(`server started listening on ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
 
io.on("connection", (socket) => {
  console.log("A new client connected to socket connection");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    // console.log('selected chat id at backend', room)
    socket.join(room);
    console.log('user joined room',  room)
  });

  socket.on('new message',(newMessageReceived) =>{
      var chat = newMessageReceived.chat

      console.log('going through newmessage',newMessageReceived)
      console.log('done with printing',newMessageReceived)

      console.log('joseph', chat  )

      if(!chat.users) return console.log('chat.user not found')      

      chat.users.forEach(user => {
        console.log('josepsh 1',user._id === newMessageReceived.sender._id )
        if(user._id === newMessageReceived.sender._id) return
        socket.in(user._id).emit("message received", newMessageReceived)
        // socket.in(user._id).emit("message received", newMessageReceived)
        // socket.in(chat._id).emit("message received", newMessageReceived)
      });
    })
    
});
