const express = require('express'),
  bodyParser = require('body-parser'),
  socket = require('socket.io');

const app = express();

app.use(bodyParser.json());

const PORT = 4000;
const io = socket(app.listen(PORT, () => console.log(`We have lift off on port ${PORT}`)));

// write socket stuff here
io.on('connection', function(socket){

  socket.on('joinRoom', function(roomName){
    console.log(roomName)
    socket.join(roomName)
  })

  socket.on('leaveRoom', function(roomName){
    socket.leave(roomName)
  })

  socket.on('sendMsg', function(data){

    io.to(data.room).emit('sendMsg', data.msg)
  })



























  // socket.on("joinRoom", function(roomNumber){
  //   socket.join(roomNumber)
  // })

  // socket.on("msg", function(data){
  //   console.log(data.message)
  //   io.to(data.room).emit("msg", data.message)
  // })

  // socket.on("someoneIsTyping", function(data){
  //   io.to(data.room).emit("someoneIsTyping", data.username)
  // })

  // socket.on("doneTyping", function(room){
  //   io.to(room).emit("doneTyping")
  // })
})