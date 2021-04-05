const ProfileHandler = require("../../handlers/ProfileHandlers");

class ProfileController {
  async setProfile(name) {
    const findResult = await ProfileHandler.findUser(name);

    if (!findResult) {
      const setData = await ProfileHandler.generate(name);
    }
  }

  async addFriend(name, friendToAdd) {
    const addingFriend = await ProfileHandler.addFriend(name, friendToAdd);
  }

  async removeFriend(name, friendToAdd) {
    const removeingFriend = await ProfileHandler.removeFriend(
      name,
      friendToAdd
    );
  }

  async getFriendList(name){
      const friendList = await ProfileHandler.getFriends(name);
      return friendList;
  }
}
module.exports = new ProfileController();
