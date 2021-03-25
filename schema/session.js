const mongoose = require("mongoose");
const { Schema } = mongoose;

const session = new Schema({
    token:String,
    isAuth:Boolean
});

const Session = mongoose.model("SessionList", session);

module.exports = Session;
