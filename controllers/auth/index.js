const DBhendlers = require("../../handlers/DBhendlers");
const PasswordHandler = require("../../handlers/PasswordHandler");
const SessionHandler = require("../../handlers/SessionHandler");

class AuthController {
  async login(login, password) {
    const result = await new DBhendlers( password,login ).findUser();

    if (result) {
      const compareResult = await new PasswordHandler(password).comparePassword(
        result.password
      );

      if (compareResult) {
        const token = await new SessionHandler(login).generate();

        return this.createLoginResponse({ exist: true, logined: true, token });
      }

      return this.createLoginResponse({
        exist: true,
        logined: false,
        message: "Incorrect Password",
      });
    }

    return this.createLoginResponse({
      exist: false,
      logined: false,
      message: "Incorrect login",
    });
  }

  createLoginResponse({ exist, logined, message, token }) {
    return { exist, logined, message, token };
  }

  async register(login, password) {
    const hashedPassword = await new PasswordHandler(password).hashPassword();

    const result = await new DBhendlers(login).findUser();

    if (!result) {
      const token = await new SessionHandler(login).generate();

      const saveUser = await new PasswordHandler().saveUser(
        login,
        hashedPassword
      );
      if (saveUser) {
        return this.createPasswordResponse({
          registrated: true,
          token,
        });
      }
    }

    return this.createPasswordResponse({
      registrated: false,
      message: "User alredy exist",
    });
  }

  createPasswordResponse({ registrated, token, message }) {
    return { registrated, token, message };
  }
}

module.exports = new AuthController();
