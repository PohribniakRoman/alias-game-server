"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let PasswordService = class PasswordService {
    constructor() {
        this.saltRounds = 10;
    }
    genHash(password) {
        return bcrypt.hashSync(password, this.saltRounds);
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
};
PasswordService = __decorate([
    (0, common_1.Injectable)()
], PasswordService);
exports.PasswordService = PasswordService;
//# sourceMappingURL=auth.password.service.js.map