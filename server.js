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

io.on("connection", (socket) => {
  socket.emit("connected", {time: new Date(), part});

  socket.on("start", () => {
    const time = new Date();
    io.sockets.emit("start", time);
  });

  socket.on("nextPart", () => {
    part.push(new Date());
    io.sockets.emit("nextPart", part);
  });

  socket.on("stop", () => {
    part = 0;
    io.sockets.emit("stop");
  });
  
  socket.on("disconnect", () => {
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));