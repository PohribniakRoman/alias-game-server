const express = require("express");
const router = require("./routes/auth");
const cors = require("cors");
const mongoose = require("mongoose");
const profile = require("./routes/profile");
const PORT = process.env.PORT || 5000;

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {
  methods: ["GET", "POST"]
}});

io.on("connect", (socket) => {
  console.log(socket.id);
});

const password = `qwer556677`;
const login = `admin`;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use("/api", profile);

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
