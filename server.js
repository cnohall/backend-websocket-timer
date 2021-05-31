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
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("start", () => {
    const time = new Date(new Date()/1000 * 1000).toISOString().substr(11, 8);
    socket.emit("start", time);
  });

  socket.on("stop", () => {
    socket.emit("stop");
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date(new Date()/1000 * 1000).toISOString().substr(11, 8);
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};



server.listen(port, () => console.log(`Listening on port ${port}`));