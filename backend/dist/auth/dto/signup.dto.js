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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupDto = exports.UserRole = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var UserRole;
(function (UserRole) {
    UserRole["CANDIDATE"] = "CANDIDATE";
    UserRole["RECRUITER"] = "RECRUITER";
})(UserRole || (exports.UserRole = UserRole = {}));
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Format d\'email invalide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email est obligatoire' }),
    (0, class_validator_1.MaxLength)(254, { message: 'L\'email ne peut pas dépasser 254 caractères' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le mot de passe doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le mot de passe ne peut pas être vide' }),
    (0, class_validator_1.MinLength)(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' }),
    (0, class_validator_1.MaxLength)(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'
    }),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsIn)([UserRole.CANDIDATE, UserRole.RECRUITER], {
        message: 'Le rôle doit être CANDIDATE ou RECRUITER'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le rôle est obligatoire' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase()),
    __metadata("design:type", String)
], SignupDto.prototype, "role", void 0);
//# sourceMappingURL=signup.dto.js.map