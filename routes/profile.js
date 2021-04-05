const { Router } = require("express");
const profileController = require("../controllers/auth/profile.controller");
const DBhendlers = require("../handlers/DBhendlers");

const router = Router();

router.get("/friends", async (req, res) => {
  const allUsers = await new DBhendlers().getAllUsers();
  const nameList = [];
  allUsers.forEach((user) => {
    nameList.push({ login: user.login, id: user.id });
  });
  res.status(200).send({ nameList });
});

router.post("/addFriends", async (req, res) => {
  const { friendToAdd, name } = req.body;
  const add = await profileController.addFriend(name, friendToAdd);
});

router.post("/removeFriend", async (req, res) => {
  const { friendToRemove, name } = req.body;
  const remove = await profileController.removeFriend(name, friendToRemove);
});

router.post("/getAllFriends",async (req,res)=>{
  const {name} = req.body
  const friendList = await profileController.getFriendList(name)
  res.status(200).send(friendList)
})

module.exports = router;
