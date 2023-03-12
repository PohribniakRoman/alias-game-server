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
    await this.profileServices.addToFriends(data.userId,data.profile);
  }

  @Post("remove")
  async remove(@Body() data:{userId:string,profile:any}){
    await this.profileServices.removeFromFriends(data.userId,data.profile);
  }
}