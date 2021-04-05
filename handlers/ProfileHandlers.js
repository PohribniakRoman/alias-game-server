const ProfileSchema = require("../schema/profile");

class ProfileHandler {
  generate(name) {
    ProfileSchema({ name, friendList: [], win: 0, lose: 0, rating: 0 }).save();
  }
  async addFriend(name, friendToAdd) {
    const lastFriends = (await ProfileSchema.findOne({ name })).friendList;
    lastFriends.push(friendToAdd);
    const result = await ProfileSchema.updateOne(
      { name },
      { $set: { friendList: lastFriends } }
    );
  }
  async removeFriend(name, friendToRemove) {
    const lastFriends = (await ProfileSchema.findOne({ name })).friendList;
    const currentFriends = lastFriends.filter(
      (name) => name !== friendToRemove
    );
    const result = await ProfileSchema.updateOne(
      { name },
      { $set: { friendList: currentFriends } }
    );
  }
  async getFriends(name) {
    const lastFriends = (await ProfileSchema.findOne({ name })).friendList;
    return lastFriends
  }
  async findUser(name) {
    const user = await ProfileSchema.findOne({ name });
    return user;
  }
}

module.exports = new ProfileHandler();
