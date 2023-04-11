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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_schema_1 = require("../schemas/auth.schema");
const mongoose_2 = require("mongoose");
const auth_password_service_1 = require("./auth.password.service");
let AuthService = class AuthService {
    constructor(userModel, passwordService) {
        this.userModel = userModel;
        this.passwordService = passwordService;
    }
    async isUserExist(login) {
        const { success } = await this.findUser(login);
        return success;
    }
    async findUser(login) {
        const result = await this.userModel.findOne({ login });
        if (result !== null) {
            return ({ user: result, success: true });
        }
        return ({ success: false });
    }
    toRegister(user) {
        const hash = this.passwordService.genHash(user.password);
        const createUser = new this.userModel({ login: user.login, password: hash });
        return createUser.save();
    }
    async checkPassword(data) {
        const { user } = await this.findUser(data.login);
        return this.passwordService.comparePassword(data.password, user.password);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auth_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, auth_password_service_1.PasswordService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map