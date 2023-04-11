import mongoose, { Document, ObjectId } from "mongoose";
export type TokenDocument = Token & Document;
export declare class Token {
    token: string;
    _id: ObjectId;
}
export declare const TokenSchema: mongoose.Schema<Token, mongoose.Model<Token, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Token>;
