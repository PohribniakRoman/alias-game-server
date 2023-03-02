import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/auth.schema";
import { Model } from "mongoose";
import { PasswordService } from "./auth.password.service";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>,private readonly passwordService:PasswordService) {}
  async isUserExist(name): Promise<boolean> {
    const { success } = await this.findUser(name);
    return success;
  }
  async findUser(name):Promise<any>{
    const result = await this.userModel.findOne({name});
    if(result !== null){
      return({user:result,success:true});
    }
    return({success:false});
  }
  async toRegister(user):Promise<User>{
    const  hash = this.passwordService.genHash(user.password);
    const createUser = new this.userModel({name:user.name,password:hash});
    return createUser.save();
  }
  async checkPassword(data):Promise<boolean>{
    const {user} = await this.findUser(data.name);
    return this.passwordService.comparePassword(data.password,user.password);
  }
}
