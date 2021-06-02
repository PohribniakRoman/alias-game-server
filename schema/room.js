const mongoose = require("mongoose");
const { Schema } = mongoose;

const room = new Schema({
    roomId:String,
    name:Array
});

const Room = mongoose.model("rooms", room);

module.exports = Room;
