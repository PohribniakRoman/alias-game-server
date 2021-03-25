const Session = require("../schema/session");
const { v4: uuidv4 } = require("uuid");

class SessionHandler {
  constructor(login) {
    this.login = login;
    this.maxAge = 7 * 24 * 60 * 60;
  }
  generate() {
    return new Promise((resolve, reject) => {
      const token = [this.login, this.maxAge, uuidv4()].join("-q1w4/");
      resolve(token);
      Session({ token ,isAuth:true}).save();
    });
  }
}

module.exports = SessionHandler;
