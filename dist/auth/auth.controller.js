"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./authServices/auth.service");
const user_dto_1 = require("./user.dto");
const auth_token_service_1 = require("./authServices/auth.token.service");
const auth_data_service_1 = require("./authServices/auth.data.service");
const profile_services_1 = require("../profile/profile.services");
function rewriteData(user, dataService, resp) {
    const checkLogin = dataService.checkLogin(user.login);
    if (!checkLogin.success) {
        resp.json({ status: 400, message: checkLogin.message });
        return false;
    }
    user.login = checkLogin.login;
    const checkPassword = dataService.checkPassword(user.password);
    if (!checkPassword.success) {
        resp.json({ status: 400, message: checkPassword.message });
        return false;
    }
    user.password = checkPassword.password;
    return true;
}
let AuthController = class AuthController {
    constructor(authServices, tokenServices, dataService, profileServices) {
        this.authServices = authServices;
        this.tokenServices = tokenServices;
        this.dataService = dataService;
        this.profileServices = profileServices;
    }
    async Register(resp, user) {
        const rewriteResult = rewriteData(user, this.dataService, resp);
        if (!rewriteResult)
            return null;
        const isUserExist = await this.authServices.isUserExist(user.login);
        if (!isUserExist) {
            await this.authServices.toRegister(user);
            const data = await this.authServices.findUser(user.login);
            const tokenData = await this.tokenServices.createToken(data.user._id);
            await this.profileServices.createProfile(user.login, tokenData._id);
            resp.json({ status: 201, token: tokenData.token, message: "Successfully created!" });
        }
        else {
            resp.json({ status: 401, message: "User with such login already exists!" });
        }
    }
    async Login(resp, user) {
        const rewriteResult = rewriteData(user, this.dataService, resp);
        if (!rewriteResult)
            return null;
        const isUserExist = await this.authServices.isUserExist(user.login);
        if (isUserExist) {
            if (await this.authServices.checkPassword(user)) {
                const data = await this.authServices.findUser(user.login);
                const isTokenExist = await this.tokenServices.findToken(data.user.id);
                if (isTokenExist.success) {
                    await this.tokenServices.deleteToken(data.user.id);
                }
                const { token } = await this.tokenServices.createToken(data.user._id);
                resp.json({ status: 201, token, message: "Successful login!" });
            }
            else {
                resp.json({ status: 400, message: "Passwords do not match!" });
            }
        }
        else {
            resp.json({ status: 401, message: "User with such login doesn't exist!" });
        }
    }
    async IsAuthorized(resp, data) {
        const research = await this.tokenServices.findTokenByToken(data.token);
        if (research.success) {
            resp.json({ success: research.success, id: research.token._id });
        }
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Register", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Login", null);
__decorate([
    (0, common_1.Post)('/isAuthorized'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "IsAuthorized", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, auth_token_service_1.TokenServices, auth_data_service_1.DataService, profile_services_1.ProfileServices])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map