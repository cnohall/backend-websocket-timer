const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  socket.emit("FromAPI", new Date());

  socket.on("start", () => {
    const time = new Date();
    io.sockets.emit("start", time);
  });

  socket.on("stop", () => {
    io.sockets.emit("stop");
  });
  
  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));