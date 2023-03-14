import { Body, Controller, Post, Response } from "@nestjs/common";
import { ProfileServices } from "./profile.services";

@Controller("profile")
export class ProfileController{
  constructor(private readonly profileServices:ProfileServices) {
  }
  @Post("load")
  async getProfile(@Response() resp,@Body() data:{userId:string}){
    const result = await this.profileServices.getProfile(data.userId);
    if(result.success){
      resp.json({profile:result.profile,success:true})
    }else {
      resp.json({success:false})
    }
  }
  @Post("add")
  async add(@Body() data:{userId:string,profile:any}){
    await this.profileServices.addToSubscribeList(data.userId,data.profile);
    await this.profileServices.addFromSubscribersList(data.userId,data.profile);
  }

  @Post("remove")
  async remove(@Body() data:{userId:string,profile:any}){
    await this.profileServices.removeFromSubscribeList(data.userId,data.profile);
    await this.profileServices.removeFromSubscribersList(data.userId,data.profile);
  }
}