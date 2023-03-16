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
      const newProfile = new this.profileModel({username,subscribersList:[],subscribeList:[],statistic:{win:0,loss:0,tie:0},avatar:getRandomInt(10),_id:userId})
      return newProfile.save();
  }
  async getProfile(userId):Promise<any>{
    const profile = await this.profileModel.findOne({_id:new  mongoose.Types.ObjectId(userId)});
    if(profile !== null){
      return({profile,success:true});
    }
    return({success:false})
  }
  async addToSubscribeList(userId,data):Promise<any> {
    const { profile } = await this.getProfile(userId);
    const newSubscribe = profile.subscribeList.filter(profile=>profile.username !== data.username);
    newSubscribe.push(data);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(userId)},{subscribeList:newSubscribe});
  }
  async  addFromSubscribersList(userId,data):Promise<any> {
    const { profile } = await this.getProfile(userId);
    const newSubscribers = data.subscribersList.filter(profile=>profile._id !== userId);
    newSubscribers.push(profile);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(data._id)},{subscribersList:newSubscribers});
  }
  async removeFromSubscribeList(userId,data):Promise<any>{
    const { profile } = await this.getProfile(userId);
    const newSubscribe = profile.subscribeList.filter(profile=>profile.username !== data.username);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(userId)},{subscribeList:newSubscribe});
  }
  async removeFromSubscribersList(userId,data):Promise<any> {
    const newSubscribers = data.subscribersList.filter(profile=>profile._id !== userId);
    return this.profileModel.findOneAndUpdate({_id:new  mongoose.Types.ObjectId(data._id)},{subscribersList:newSubscribers});
  }

  async getAllProfiles():Promise<Array<{ id: string, username: string }>>{
    const userList = [];
    const rawData = await this.profileModel.find({});
    rawData.forEach((user) => {
      userList.push({id:user._id,username:user.username});
    });
    return userList;
  }
}