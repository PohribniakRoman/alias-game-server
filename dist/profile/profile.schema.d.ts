import mongoose, { Document, ObjectId } from "mongoose";
export type ProfileDocument = Profile & Document;
export declare class Profile {
    username: string;
    subscribersList: object;
    subscribeList: object;
    statistic: object;
    avatar: number;
    _id: ObjectId;
}
export declare const ProfileSchema: mongoose.Schema<Profile, mongoose.Model<Profile, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Profile>;
