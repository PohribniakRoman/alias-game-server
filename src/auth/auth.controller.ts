import { Body, Response,Controller, Post } from "@nestjs/common";
import { AuthService } from './authServices/auth.service';
import { UserDto } from "./user.dto";
import { TokenServices } from "./authServices/auth.token.service";
import { DataService } from "./authServices/auth.data.service";
import { ProfileServices } from "../profile/profile.services";


function rewriteData(user,dataService,resp):boolean{
  const checkLogin = dataService.checkLogin(user.login);
  if(!checkLogin.success) {
    resp.json({status:400,message:checkLogin.message})
    return false;
  }
  user.login = checkLogin.login;
  const checkPassword = dataService.checkPassword(user.password);
  if(!checkPassword.success){
    resp.json({status:400,message:checkPassword.message})
    return false;
  }
  user.password = checkPassword.password;
  return true;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService,private readonly tokenServices:TokenServices,private readonly dataService:DataService,private readonly profileServices:ProfileServices) {}
  @Post('/register')
  async Register(@Response() resp,@Body() user:UserDto){
    const rewriteResult = rewriteData(user,this.dataService,resp);
    if(!rewriteResult)return null
    const isUserExist = await this.authServices.isUserExist(user.login);
      if(!isUserExist){
        await this.authServices.toRegister(user);
        const data = await this.authServices.findUser(user.login);
        const tokenData = await this.tokenServices.createToken(data.user._id);
        await this.profileServices.createProfile(user.login,tokenData._id);
        resp.json({status:201,token:tokenData.token,message:"Successfully created!"})
      }else{
        resp.json({status:401,message:"User with such login already exists!"})
      }
  }
  @Post('/login')
  async Login(@Response() resp,@Body() user:UserDto) {
    const rewriteResult = rewriteData(user, this.dataService, resp);
    if (!rewriteResult) return null

    const isUserExist = await this.authServices.isUserExist(user.login);
    if (isUserExist) {
      if (await this.authServices.checkPassword(user)) {
        const data = await this.authServices.findUser(user.login);
        const isTokenExist = await this.tokenServices.findToken(data.user.id)
        if (isTokenExist.success) {
          await this.tokenServices.deleteToken(data.user.id);
        }
        const { token } = await this.tokenServices.createToken(data.user._id);
        resp.json({ status: 201, token, message: "Successful login!" })
      } else {
        resp.json({ status: 400, message: "Passwords do not match!" })
      }
    } else {
      resp.json({ status: 401, message: "User with such login doesn't exist!" })
    }
  }


  @Post('/isAuthorized')
  async IsAuthorized(@Response() resp,@Body() data:{token:string}){
      const research = await this.tokenServices.findTokenByToken(data.token);
      if(research.success){
        resp.json({success:research.success,id:research.token._id});
      }
    }
}
