const { Router } = require("express");
const DBhendlers = require("../handlers/DBhendlers");
const PasswordHandler = require("../handlers/PasswordHandler");
const AuthSchema = require("../schema/auth");
const SessionHandler = require("../handlers/SessionHandler");

const router = Router();

router.post("/isAuthenticated", (req, res) => {
  const { token } = req.body;
  new DBhendlers().findToken(token).then((result) => {
    res.send(JSON.stringify({ isAuthenticated: result }));
  });
});

router.post("/login", (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);
  res.send(JSON.stringify({ exist: false, entered: false }));
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
          console.log(token);
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
