import { Injectable } from "@nestjs/common";

interface functionReturn {
  success:boolean,
  [key:string]:any
}

@Injectable()
export class DataService{
  checkLogin(login):functionReturn{
      if(login.trim().length > 2){
        return {success:true,login:login.trim().toLowerCase()}
      }
      return { success:false,message:"Login is too short(3 characters minimum)" };
  }
  checkPassword(password):functionReturn{
    if(password.trim().length > 5){
      return {success:true,password:password.trim().toLowerCase()}
    }
    return { success:false,message:"Password is too short(6 characters minimum)" };
  }
}

