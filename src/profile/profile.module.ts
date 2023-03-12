import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { Profile, ProfileSchema } from "./profile.schema";
import { ProfileServices } from "./profile.services";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
  controllers:[ProfileController],
  providers: [ProfileServices],
  imports:[MongooseModule.forFeature([
    {name:Profile.name,schema:ProfileSchema},
  ])]
})

export class ProfileModule {}
