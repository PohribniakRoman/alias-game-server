import { Token, TokenDocument } from "../schemas/token.schema";
import { Model } from "mongoose";
export declare class TokenServices {
    private tokenModel;
    constructor(tokenModel: Model<TokenDocument>);
    genToken(): string;
    createToken(forId: any): Promise<Token>;
    deleteToken(forId: any): Promise<any>;
    findToken(forId: any): Promise<any>;
    findTokenByToken(token: any): Promise<any>;
}
