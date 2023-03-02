import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { keys } from './keys';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      `mongodb+srv://${keys.login}:${keys.password}@cluster0.l81t4ui.mongodb.net/?retryWrites=true&w=majority`,
    ),
  ],
})
export class AppModule {}
