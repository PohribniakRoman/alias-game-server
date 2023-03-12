import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

export type ProfileDocument = Profile & Document;
const ObjectIdConstructor = mongoose.Types.ObjectId;
@Schema()
export class Profile{
  @Prop({required:true,type:String})
  username:string;
  @Prop({required:true,type:Array})
  friends:object;
  @Prop({required:true,type:Object})
  statistic:object;
  @Prop({required:true,type:Number})
  avatar:number;
  @Prop({required:true,type:ObjectIdConstructor})
  _id:ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)