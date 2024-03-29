"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
let DataService = class DataService {
    checkLogin(login) {
        if (login.trim().length > 2) {
            return { success: true, login: login.trim().toLowerCase() };
        }
        return { success: false, message: "Login is too short(3 characters minimum)" };
    }
    checkPassword(password) {
        if (password.trim().length > 5) {
            return { success: true, password: password.trim().toLowerCase() };
        }
        return { success: false, message: "Password is too short(6 characters minimum)" };
    }
};
DataService = __decorate([
    (0, common_1.Injectable)()
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=auth.data.service.js.map