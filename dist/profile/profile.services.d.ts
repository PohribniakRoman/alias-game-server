import { Model } from "mongoose";
import { Profile, ProfileDocument } from "./profile.schema";
export declare class ProfileServices {
    private profileModel;
    constructor(profileModel: Model<ProfileDocument>);
    createProfile(username: any, userId: any): Promise<Profile>;
    getProfile(userId: any): Promise<any>;
    addToSubscribeList(userId: any, data: any): Promise<any>;
    addFromSubscribersList(userId: any, data: any): Promise<any>;
    removeFromSubscribeList(userId: any, data: any): Promise<any>;
    removeFromSubscribersList(userId: any, data: any): Promise<any>;
    getAllProfiles(): Promise<Array<{
        id: string;
        username: string;
    }>>;
}
