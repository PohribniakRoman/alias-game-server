const DBhendlers = require("../../handlers/DBhendlers");
const PasswordHandler = require("../../handlers/PasswordHandler");
const SessionHandler = require("../../handlers/SessionHandler");

class AuthController {
  async login(login, password) {
    const result = await new DBhendlers(password, login).findUser();

    if (result) {
      const compareResult = await new PasswordHandler(password).comparePassword(
        result.password
      );

      if (compareResult) {
        const token = await new SessionHandler(login).generate();

        return this.createResponse({ exist: true, logined: true, token });
      }

      return this.createResponse({
        exist: true,
        logined: false,
        massege: "Incorrect Password",
      });
    }

    return this.createResponse({
      exist: false,
      logined: false,
      massege: "Incorrect login",
    });
  }

  createResponse({ exist, logined, massege, token }) {
    return { exist, logined, massege, token };
  }
}

module.exports = new AuthController();

// const result = await new DBhendlers(password, login).findUser();
//   if (result) {
//     const compareResult = await new PasswordHandler(password).comparePassword(
//       result.password
//       );
//       if (compareResult) {
//       console.log(compareResult);
//       const token = await new SessionHandler(login).generate();
//       res.send(JSON.stringify({ exist: true, logined: true, token }));
//     } else {
//       res.send(
//         JSON.stringify({
//           exist: true,
//           logined: false,
//           massege: "Incorrect Password",
//         })
//       );
//     }
//   } else {
//     res.send(
//       JSON.stringify({
//         exist: false,
//         logined: false,
//         massege: "Incorrect login",
//       })
//     );
//   }
