import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UserDto } from "./user.dto";
import { TokenServices } from "./auth.token.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService,private readonly tokenServices:TokenServices) {}
  @Post('/register')
  async Register(@Body() user:UserDto){
    const isUserExist = await this.authServices.isUserExist(user.name);
    if(!isUserExist){
      this.authServices.toRegister(user);
    }
  }
  @Post('/login')
  async Login(@Body() user:UserDto){
    const isUserExist = await this.authServices.isUserExist(user.name);
    if(isUserExist){
      if(await this.authServices.checkPassword(user)){
            const data = await this.authServices.findUser(user.name);
            await this.tokenServices.createToken(data.user._id);
      }
    }
  }
}
