import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Profile, ProfileDocument } from "./profile.schema";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


@Injectable()
export class ProfileServices{
  constructor(@InjectModel(Profile.name) private profileModel:Model<ProfileDocument>) {}
  createProfile(username,userId):Promise<Profile>{
      const newProfile = new this.profileModel({username,friends:[],statistic:{win:0,loss:0,tie:0},avatar:getRandomInt(10),_id:userId})
      return newProfile.save();
  }
  async getProfile(userId):Promise<any>{
    const profile = await this.profileModel.findOne({_id:new  mongoose.Types.ObjectId(userId)});
    if(profile !== null){
      return({profile,success:true});
    }
    return({success:false})
  }
  async addToFriends(userId,data):Promise<any>{
    const { profile } = await this.getProfile(userId);
    const newFriends = profile.friends.filter(profile=>profile.username !== data.username);
    newFriends.push(data);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(userId)},{friends:newFriends});
  }
  async removeFromFriends(userId,data):Promise<any>{
    const { profile } = await this.getProfile(userId);
    const newFriends = profile.friends.filter(profile=>profile.username !== data.username);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(userId)},{friends:newFriends});
  }
}