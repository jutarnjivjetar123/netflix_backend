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
let UserVerificationToken = class UserVerificationToken {
    verificationTokenID;
    createdAt;
    expiresAt;
    tokenOwner;
    tokenType;
    tokenPayload;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserVerificationToken.prototype, "verificationTokenID", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserVerificationToken.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserVerificationToken.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.default),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_model_1.default)
], UserVerificationToken.prototype, "tokenOwner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserVerificationToken.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserVerificationToken.prototype, "tokenPayload", void 0);
UserVerificationToken = __decorate([
    (0, typeorm_1.Entity)("UserVerificationToken", {
        schema: "Users",
    })
], UserVerificationToken);
exports.default = UserVerificationToken;
//# sourceMappingURL=verificationToken.model.js.map