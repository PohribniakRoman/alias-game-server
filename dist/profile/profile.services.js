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
exports.ProfileServices = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const profile_schema_1 = require("./profile.schema");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let ProfileServices = class ProfileServices {
    constructor(profileModel) {
        this.profileModel = profileModel;
    }
    createProfile(username, userId) {
        const newProfile = new this.profileModel({ username, subscribersList: [], subscribeList: [], statistic: { win: 0, loss: 0, tie: 0 }, avatar: getRandomInt(10), _id: userId });
        return newProfile.save();
    }
    async getProfile(userId) {
        const profile = await this.profileModel.findOne({ _id: new mongoose_2.default.Types.ObjectId(userId) });
        if (profile !== null) {
            return ({ profile, success: true });
        }
        return ({ success: false });
    }
    async addToSubscribeList(userId, data) {
        const { profile } = await this.getProfile(userId);
        const newSubscribe = profile.subscribeList.filter(profile => profile.username !== data.username);
        newSubscribe.push(data);
        return this.profileModel.findOneAndUpdate({ _id: new mongoose_2.default.Types.ObjectId(userId) }, { subscribeList: newSubscribe });
    }
    async addFromSubscribersList(userId, data) {
        const { profile } = await this.getProfile(userId);
        const newSubscribers = data.subscribersList.filter(profile => profile._id !== userId);
        newSubscribers.push(profile);
        return this.profileModel.findOneAndUpdate({ _id: new mongoose_2.default.Types.ObjectId(data._id) }, { subscribersList: newSubscribers });
    }
    async removeFromSubscribeList(userId, data) {
        const { profile } = await this.getProfile(userId);
        const newSubscribe = profile.subscribeList.filter(profile => profile.username !== data.username);
        return this.profileModel.findOneAndUpdate({ _id: new mongoose_2.default.Types.ObjectId(userId) }, { subscribeList: newSubscribe });
    }
    async removeFromSubscribersList(userId, data) {
        const newSubscribers = data.subscribersList.filter(profile => profile._id !== userId);
        return this.profileModel.findOneAndUpdate({ _id: new mongoose_2.default.Types.ObjectId(data._id) }, { subscribersList: newSubscribers });
    }
    async getAllProfiles() {
        const userList = [];
        const rawData = await this.profileModel.find({});
        rawData.forEach((user) => {
            userList.push({ id: user._id, username: user.username });
        });
        return userList;
    }
};
ProfileServices = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProfileServices);
exports.ProfileServices = ProfileServices;
//# sourceMappingURL=profile.services.js.map