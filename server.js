const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let part = [];
let startingTime;
let connections = 0;

io.on("connection", (socket) => {
  socket.emit("connected", {startingTime, time: new Date(), part, connections});
  if(connections > 0){
    startingTime = new Date();
    let ms = 1000 * 60; // convert minutes to ms
    let roundedDate = new Date(Math.round(startingTime.getTime() / ms) * ms);
    io.sockets.emit("start", roundedDate);
  }
  connections++;


  socket.on("start", () => {
    startingTime = new Date();
    let ms = 1000 * 60; // convert minutes to ms
    let roundedDate = new Date(Math.round(startingTime.getTime() / ms) * ms);
    io.sockets.emit("start", roundedDate);
  });

  socket.on("nextPart", () => {
    part.push(new Date());
    io.sockets.emit("nextPart", part);
  });

  socket.on("stop", () => {
    part = [];
    startingTime = 0;
    io.sockets.emit("stop");
  });
  
  socket.on("disconnect", () => {
    connections--;
    if (connections === 0){
      part = [];
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));