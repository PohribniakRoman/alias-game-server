import { ProfileServices } from "./profile.services";
export declare class ProfileController {
    private readonly profileServices;
    constructor(profileServices: ProfileServices);
    getProfile(resp: any, data: {
        userId: string;
    }): Promise<void>;
    add(data: {
        userId: string;
        profile: any;
    }): Promise<void>;
    remove(data: {
        userId: string;
        profile: any;
    }): Promise<void>;
    getAll(resp: any): Promise<void>;
}
