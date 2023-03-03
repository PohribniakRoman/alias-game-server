
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from "./schemas/auth.schema";
import { PasswordService } from "./auth.password.service";
import { TokenServices } from "./auth.token.service";
import { Token, TokenSchema } from "./schemas/token.schema";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PasswordService,TokenServices],
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema},
    {name:Token.name,schema:TokenSchema}
  ])]
})
export class AuthModule {}
