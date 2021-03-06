const { Router } = require("express");
const DBhendlers = require("../handlers/DBhendlers");
const authController = require("../controllers/auth/index");
const profileController = require("../controllers/auth/profile.controller");

const router = Router();

router.post("/isAuthenticated", (req, res) => {
  const { token } = req.body;
  new DBhendlers().findToken(token).then((result) => {
    res.send(JSON.stringify({ isAuthenticated: result }));
  });
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const loginResult = await authController.login(login, password);
  res.status(200).send(loginResult);
});

router.post("/register", async (req, res) => {
  const { login, password } = req.body;
  const regResult = await authController.register(login, password);
  const setProfile = await profileController.setProfile(login);
  res.status(200).send(regResult);
});


module.exports = router;
