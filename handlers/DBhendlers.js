const Candidate = require("../schema/auth");
const Session = require("../schema/session");

class DBhendlers {
  constructor(password, login) {
    this.password = password;
    this.login = login;
  }
  findUser() {
    return Candidate.findOne({ login: this.login });
  }
  findToken(token) {
    return Session.findOne({ token });
  }
  
  getAllUsers(){
    return Candidate.find({})
  }
}

module.exports = DBhendlers;
