import { Injectable } from "@nestjs/common";
const bcrypt = require("bcrypt");
@Injectable()
export class PasswordService{
  private saltRounds = 10;
  genHash(password):string{
    return bcrypt.hashSync(password,this.saltRounds);
  }

  comparePassword(password,hash):boolean{
   return bcrypt.compareSync(password,hash)
  }

}
