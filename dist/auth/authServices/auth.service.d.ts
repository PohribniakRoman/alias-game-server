import { User, UserDocument } from "../schemas/auth.schema";
import { Model } from "mongoose";
import { PasswordService } from "./auth.password.service";
export declare class AuthService {
    private userModel;
    private readonly passwordService;
    constructor(userModel: Model<UserDocument>, passwordService: PasswordService);
    isUserExist(login: any): Promise<boolean>;
    findUser(login: any): Promise<any>;
    toRegister(user: any): Promise<User>;
    checkPassword(data: any): Promise<boolean>;
}
