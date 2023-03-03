import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

export type TokenDocument = Token & Document;
const ObjectIdConstructor = mongoose.Types.ObjectId
@Schema()
export class Token{
  @Prop({required:true,type:String})
  token:string;
  @Prop({required:true,type:ObjectIdConstructor})
  _id:ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token)