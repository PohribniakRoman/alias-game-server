const express = require("express");
const router = require("./routes/auth");
const cors = require("cors");
const mongoose = require("mongoose");
const profile = require("./routes/profile");
const game = require("./routes/game");
const { validate, version } = require("uuid");

const PORT = process.env.PORT || 5000;

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

function getClientRooms() {
  const { rooms } = io.sockets.adapter;
  return Array.from(rooms.keys()).filter(
    (r) => validate(r) && version(r) === 4
  );
}

function shareRoomsInfo() {
  io.emit("SHARE_ROOMS", {
    rooms: getClientRooms(),
  });
}

io.on("connect", (socket) => {
  function leaveRoom() {
    const { rooms } = socket;
  
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  
      clients.forEach((clientId) => {
        io.to(clientId).emit("LEFT", {
          userId: socket.id,
        });
  
        socket.emit("LEFT", {
          userId: clientId,
        });
      });
  
      socket.leave(roomId);
    });
  
    shareRoomsInfo();
  }
  
  shareRoomsInfo();

  socket.on("FETCH_ROOMS", () => {
    socket.emit("SHARE_ROOMS", {
      rooms: getClientRooms(),
    });
  });

  socket.on("JOIN_ROOM", ({ id: roomId}) => {
    if (validate(roomId) && version(roomId) === 4) {
      socket.join(roomId);
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      socket.to(roomId).emit("ENTER", {
        newClientId: socket.id,
      });
      
      socket.emit("ENTER", {
        clients: clients.filter((c) => c !== socket.id),
      });
      shareRoomsInfo();
    }
  });

  socket.on("SAY_HI",({id,name})=>{
    if (validate(id) && version(id) === 4) {
      const clients = Array.from(io.sockets.adapter.rooms.get(id) || []).filter(client => client !== socket.id);
      clients.forEach(client =>{
        io.to(client).emit("HELLO",name)
      })
    }
  })


  socket.on("LEAVE_ROOM", leaveRoom);

  socket.on("disconnecting", leaveRoom);
});

const password = `qwer556677`;
const login = `admin`;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use("/api", profile);
app.use("/api", game);

async function start() {
  await mongoose.connect(
    `mongodb+srv://${login}:${password}@cluster0.o7x2c.mongodb.net`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}

start();
