import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token{
  @Prop({required:true,type:String})
  token:string;
  @Prop()
  _id:ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token)