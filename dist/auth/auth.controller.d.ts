import { AuthService } from './authServices/auth.service';
import { UserDto } from "./user.dto";
import { TokenServices } from "./authServices/auth.token.service";
import { DataService } from "./authServices/auth.data.service";
import { ProfileServices } from "../profile/profile.services";
export declare class AuthController {
    private readonly authServices;
    private readonly tokenServices;
    private readonly dataService;
    private readonly profileServices;
    constructor(authServices: AuthService, tokenServices: TokenServices, dataService: DataService, profileServices: ProfileServices);
    Register(resp: any, user: UserDto): Promise<any>;
    Login(resp: any, user: UserDto): Promise<any>;
    IsAuthorized(resp: any, data: {
        token: string;
    }): Promise<void>;
}
