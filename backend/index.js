const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const express = require("express");

const PORT = 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
  },
});

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
  })
);

io.on("connection", function (socket) {
  console.log("User Connected " + socket.id);

  socket.on(
    "message",
    function ({ room, message, name, userId, audio, vedio }) {
      console.log("message received");
      console.log({ room, message, name, userId, audio, vedio });

      io.to(room).emit("receive-message", {
        userId,
        name,
        message,
        audio,
        vedio,
      });
    }
  );

  socket.on("disconnect", function () {
    console.log("User diconnected " + socket.id);
  });

  socket.on("joinRoom", function (room) {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });
});

app.get("/", function (req, res) {});

server.listen(PORT, function () {
  console.log(`Server Running on PORT ${PORT}`);
});

// app.listen(8000);
