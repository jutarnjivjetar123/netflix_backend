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
let UserSalt = class UserSalt {
    saltID;
    salt;
    createdAt;
    updatedAt;
    deletedAt;
    saltOwner;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserSalt.prototype, "saltID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSalt.prototype, "salt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserSalt.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserSalt.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserSalt.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.default),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_model_1.default)
], UserSalt.prototype, "saltOwner", void 0);
UserSalt = __decorate([
    (0, typeorm_1.Entity)("UserSalt", {
        schema: "Users",
    })
], UserSalt);
exports.default = UserSalt;
//# sourceMappingURL=salt.model.js.map