import { Injectable } from "@nestjs/common";
import { v4 } from  "uuid";
import { InjectModel } from "@nestjs/mongoose";
import { Token, TokenDocument } from "./schemas/token.schema";
import { Model } from "mongoose";
@Injectable()
export class TokenServices{
  constructor(@InjectModel(Token.name) private tokenModel:Model<TokenDocument>) {}
  genToken():string{
    return v4;
  }
  async createToken(forId):Promise<Token>{
    const newToken = new this.tokenModel({token:this.genToken(),_id:forId})
    return newToken.save();
  }
  async deleteToken(forId):Promise<any>{
    return this.tokenModel.deleteOne({ _id: forId });
  }

  async findToken(data):Promise<any>{
    const token = await this.tokenModel.findOne({data});
    if(token !== null){
      return({token,success:true});
    }
    return({success:false})
  }
}