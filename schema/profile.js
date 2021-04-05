const mongoose = require("mongoose");
const { Schema } = mongoose;

const profile = new Schema({
  name: String,
  friendList: Array,
  win: Number,
  lose: Number,
  rating: Number,
});

const Profile = mongoose.model("Profiles", profile);

module.exports = Profile;
