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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_services_1 = require("./profile.services");
let ProfileController = class ProfileController {
    constructor(profileServices) {
        this.profileServices = profileServices;
    }
    async getProfile(resp, data) {
        const result = await this.profileServices.getProfile(data.userId);
        if (result.success) {
            resp.json({ profile: result.profile, success: true });
        }
        else {
            resp.json({ success: false });
        }
    }
    async add(data) {
        await this.profileServices.addToSubscribeList(data.userId, data.profile);
        await this.profileServices.addFromSubscribersList(data.userId, data.profile);
    }
    async remove(data) {
        await this.profileServices.removeFromSubscribeList(data.userId, data.profile);
        await this.profileServices.removeFromSubscribersList(data.userId, data.profile);
    }
    async getAll(resp) {
        const userlist = await this.profileServices.getAllProfiles();
        resp.json(userlist);
    }
};
__decorate([
    (0, common_1.Post)("load"),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "add", null);
__decorate([
    (0, common_1.Post)("remove"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("all"),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getAll", null);
ProfileController = __decorate([
    (0, common_1.Controller)("profile"),
    __metadata("design:paramtypes", [profile_services_1.ProfileServices])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map