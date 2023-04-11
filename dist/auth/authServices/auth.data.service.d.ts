interface functionReturn {
    success: boolean;
    [key: string]: any;
}
export declare class DataService {
    checkLogin(login: any): functionReturn;
    checkPassword(password: any): functionReturn;
}
export {};
