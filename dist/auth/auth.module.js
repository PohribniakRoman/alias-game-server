"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./authServices/auth.service");
const auth_schema_1 = require("./schemas/auth.schema");
const auth_password_service_1 = require("./authServices/auth.password.service");
const auth_token_service_1 = require("./authServices/auth.token.service");
const token_schema_1 = require("./schemas/token.schema");
const auth_data_service_1 = require("./authServices/auth.data.service");
const profile_services_1 = require("../profile/profile.services");
const profile_schema_1 = require("../profile/profile.schema");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, auth_password_service_1.PasswordService, auth_token_service_1.TokenServices, auth_data_service_1.DataService, profile_services_1.ProfileServices],
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: auth_schema_1.User.name, schema: auth_schema_1.UserSchema },
                { name: profile_schema_1.Profile.name, schema: profile_schema_1.ProfileSchema },
                { name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema }
            ])]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map