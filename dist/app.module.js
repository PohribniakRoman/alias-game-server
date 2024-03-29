"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const mongoose_1 = require("@nestjs/mongoose");
const keys_1 = require("./keys");
const profile_module_1 = require("./profile/profile.module");
const game_gateway_1 = require("./game/game.gateway");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        providers: [game_gateway_1.GameGateway],
        imports: [
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            mongoose_1.MongooseModule.forRoot(`mongodb+srv://${keys_1.keys.login}:${keys_1.keys.password}@cluster0.l81t4ui.mongodb.net/?retryWrites=true&w=majority`),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map