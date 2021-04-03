const bcrypt = require("bcrypt");
const saltRounds = 10;
const AuthSchema = require("../schema/auth");

class PasswordHandler {
  constructor(password) {
    this.password = password;
  }
  hashPassword() {
    return new Promise((resolve, reject) => {
      bcrypt.hash(this.password, saltRounds).then((hash) => {
        resolve(hash);
      });
    });
  }
  comparePassword(userPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(this.password, userPassword).then((result) => {
        resolve(result);
      });
    });
  }
  saveUser(login, password) {
    return new Promise((resolve, reject) => {
      AuthSchema({ login, password }).save();
      resolve(true);
    });
  }
}

module.exports = PasswordHandler;
