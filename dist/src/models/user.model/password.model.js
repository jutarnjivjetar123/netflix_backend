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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_model_1 = __importDefault(require("./user.model"));
let UserPassword = class UserPassword {
    passwordID;
    salt;
    hash;
    createdAt;
    updatedAt;
    user;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserPassword.prototype, "passwordID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserPassword.prototype, "salt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserPassword.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserPassword.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserPassword.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.default),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_model_1.default)
], UserPassword.prototype, "user", void 0);
UserPassword = __decorate([
    (0, typeorm_1.Entity)("UserPassword", {
        schema: "Users",
    })
], UserPassword);
exports.default = UserPassword;
//# sourceMappingURL=password.model.js.map