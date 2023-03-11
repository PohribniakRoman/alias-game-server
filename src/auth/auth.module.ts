
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { AuthController } from './auth.controller';
import { AuthService } from './authServices/auth.service';
import { User, UserSchema } from "./schemas/auth.schema";
import { PasswordService } from "./authServices/auth.password.service";
import { TokenServices } from "./authServices/auth.token.service";
import { Token, TokenSchema } from "./schemas/token.schema";
import { DataService } from "./authServices/auth.data.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PasswordService,TokenServices,DataService],
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema},
    {name:Token.name,schema:TokenSchema}
  ])]
})
export class AuthModule {}
