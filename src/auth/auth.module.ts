
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { AuthController } from './auth.controller';
import { AuthService } from './authServices/auth.service';
import { User, UserSchema } from "./schemas/auth.schema";
import { PasswordService } from "./authServices/auth.password.service";
import { TokenServices } from "./authServices/auth.token.service";
import { Token, TokenSchema } from "./schemas/token.schema";
import { DataService } from "./authServices/auth.data.service";
import { ProfileServices } from "../profile/profile.services";
import { Profile, ProfileSchema } from "../profile/profile.schema";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PasswordService,TokenServices,DataService,ProfileServices],
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema},
    {name:Profile.name,schema:ProfileSchema},
    {name:Token.name,schema:TokenSchema}
  ])]
})
export class AuthModule {}
