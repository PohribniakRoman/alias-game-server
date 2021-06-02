const express = require("express");
const router = require("./routes/auth");
const cors = require("cors");
const mongoose = require("mongoose");
const profile = require("./routes/profile");
const game = require("./routes/game");
const { validate, version } = require("uuid");
const Room = require("./schema/room");

const PORT = process.env.PORT || 5000;

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

function getRooms() {
  return [...io.sockets.adapter.rooms.keys()].filter((roomId) =>
    validate(roomId)
  );
}
function shareRooms() {
  io.emit("SHARE_ROOMS", { rooms: getRooms() });
}

io.on("connect", (socket) => {
  socket.on("JOIN_ROOM", ({ roomId, name }) => {
    if (validate(roomId) && version(roomId) === 4) {
      socket.join(roomId);
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      io.in(roomId).emit("ENTER", {
        clients,
        newClient_id: socket.id,
      });
      Room.findOne({ roomId }).then((exist) => {
        if (!exist) {
          new Room({ roomId, name }).save();
        } else {
          if (!exist.name.includes(name)) {
            const currentNames = [...exist.name,name]
            Room.updateOne({ roomId }, { $set: {name:currentNames} }).then();
          }
        }
      });
      shareRooms();
    }
  });

  socket.on("LEAVE_ROOM", ({ roomId,name}) => {
    const clients = Array.from(
      io.sockets.adapter.rooms.get(roomId) || []
    ).filter((user) => user !== socket.id);
    io.in(roomId).emit("LEFT", {
      clients,
      leftClient_id: socket.id,
    });
    socket.leave(roomId);
    Room.findOne({ roomId }).then((exist) => {
        const currentNames = exist.name.filter(r => r !== name);
        if (currentNames.length === 0) {
          Room.deleteOne({roomId}).then();
        }else{
          Room.updateOne({ roomId }, { $set: {name:currentNames} }).then();
        }
    });
    shareRooms();
  });

  socket.on("GET_ROOMS", () => {
    shareRooms();
  });
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
