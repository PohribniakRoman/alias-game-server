const { Router } = require("express");
const DBhendlers = require("../handlers/DBhendlers");
const PasswordHandler = require("../handlers/PasswordHandler");
const AuthSchema = require("../schema/auth");
const SessionHandler = require("../handlers/SessionHandler");
const authController = require("../controllers/auth/index");

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

router.post("/register", (req, res) => {
  const { login, password } = req.body;

  new PasswordHandler(password).hashPassword().then((hashedPassword) => {
    new DBhendlers(password, login).findUser().then((result) => {
      if (!result) {
        const user = AuthSchema({
          login: login,
          password: hashedPassword,
        });
        user.save();
        new SessionHandler(login).generate().then((token) => {
          res.send(JSON.stringify({ registrated: true, token }));
        });
      } else {
        res.send(
          JSON.stringify({ registrated: false, massege: "User alredy exist" })
        );
      }
    });
  });
});

module.exports = router;
