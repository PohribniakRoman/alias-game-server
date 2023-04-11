export declare class PasswordService {
    private saltRounds;
    genHash(password: any): string;
    comparePassword(password: any, hash: any): boolean;
}
