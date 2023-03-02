import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UserDto } from "./user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
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
      if(this.authServices.checkPassword(user)){
        //gen token & redirect
      }
    }
  }
}
