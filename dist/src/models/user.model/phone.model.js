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
const user_model_1 = __importDefault(require("../user.model/user.model"));
let UserPhoneNumber = class UserPhoneNumber {
    phoneNumberID;
    phoneNumber;
    internationalCallingCode;
    user;
    createdAt;
    modifiedAt;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserPhoneNumber.prototype, "phoneNumberID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserPhoneNumber.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserPhoneNumber.prototype, "internationalCallingCode", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.OneToOne)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], UserPhoneNumber.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserPhoneNumber.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserPhoneNumber.prototype, "modifiedAt", void 0);
UserPhoneNumber = __decorate([
    (0, typeorm_1.Entity)("UserPhoneNumber", {
        schema: "Users",
    })
], UserPhoneNumber);
exports.default = UserPhoneNumber;
//# sourceMappingURL=phone.model.js.map