import { AuthController } from './auth.controller';

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/auth.schema";
import { PasswordService } from "./auth.password.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PasswordService],
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema}
  ])]
})
export class AuthModule {}
