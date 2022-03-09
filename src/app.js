const express = require("express");
const app = express();
const uuid = require("uuid").v4;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("chat message", (msg, roomId) => {
    console.log("message: " + msg);
    io.to(roomId).emit("chat message", msg);
    // socket.broadcast.emit("chat message", msg);
  });

  socket.on("create-room", () => {
    let roomId = uuid();
    socket.join(`${roomId}`);
    io.to(roomId).emit("new-room", roomId);
  });

  socket.on("join-room", (roomId, userName) => {
    socket.join(`${roomId}`);
    io.to(roomId).emit("new-participant", userName, roomId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
