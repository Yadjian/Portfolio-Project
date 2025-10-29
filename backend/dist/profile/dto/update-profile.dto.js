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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.firstName !== undefined && o.firstName !== null),
    (0, class_validator_1.IsString)({ message: 'Le prénom doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom ne peut pas être vide' }),
    (0, class_validator_1.MinLength)(1, { message: 'Le prénom doit contenir au moins 1 caractère' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Le prénom est trop long (max 100 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.lastName !== undefined && o.lastName !== null),
    (0, class_validator_1.IsString)({ message: 'Le nom doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom ne peut pas être vide' }),
    (0, class_validator_1.MinLength)(1, { message: 'Le nom doit contenir au moins 1 caractère' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Le nom est trop long (max 100 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.locationWKT !== undefined && o.locationWKT !== null),
    (0, class_validator_1.IsString)({ message: 'La localisation doit être une chaîne de caractères' }),
    (0, class_validator_1.MaxLength)(500, { message: 'La localisation WKT est trop longue (max 500 caractères)' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationWKT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.locationName !== undefined && o.locationName !== null),
    (0, class_validator_1.IsString)({ message: 'Le nom de lieu doit être une chaîne de caractères' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom de lieu est trop long (max 255 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "locationName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.interestedInCategoryIds !== undefined && o.interestedInCategoryIds !== null),
    (0, class_validator_1.IsArray)({ message: 'Les catégories doivent être un tableau' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Chaque catégorie doit être un UUID valide' }),
    (0, class_validator_1.ArrayMaxSize)(30, { message: 'Trop de catégories sélectionnées (max 30)' }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "interestedInCategoryIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.coverLetterText !== undefined && o.coverLetterText !== null),
    (0, class_validator_1.IsString)({ message: 'La lettre de motivation doit être une chaîne de caractères' }),
    (0, class_validator_1.MaxLength)(10000, { message: 'La lettre de motivation est trop longue (max 10 000 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "coverLetterText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.desiredJobTitle !== undefined && o.desiredJobTitle !== null),
    (0, class_validator_1.IsString)({ message: 'Le titre du poste désiré doit être une chaîne de caractères' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Le titre du poste est trop long (max 150 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "desiredJobTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.experienceLevel !== undefined && o.experienceLevel !== null),
    (0, class_validator_1.IsEnum)(client_1.ExperienceLevel, { message: 'Niveau d\'expérience invalide' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.desiredExperienceLevel !== undefined && o.desiredExperienceLevel !== null),
    (0, class_validator_1.IsEnum)(client_1.ExperienceLevel, { message: 'Niveau d\'expérience désiré invalide' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "desiredExperienceLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.desiredContractTypes !== undefined && o.desiredContractTypes !== null),
    (0, class_validator_1.IsArray)({ message: 'Les types de contrat doivent être un tableau' }),
    (0, class_validator_1.IsEnum)(client_1.ContractType, { each: true, message: 'Type de contrat invalide' }),
    (0, class_validator_1.ArrayMaxSize)(10, { message: 'Trop de types de contrat sélectionnés (max 10)' }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "desiredContractTypes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.searchDescription !== undefined && o.searchDescription !== null),
    (0, class_validator_1.IsString)({ message: 'La description de recherche doit être une chaîne de caractères' }),
    (0, class_validator_1.MaxLength)(5000, { message: 'La description de recherche est trop longue (max 5 000 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "searchDescription", void 0);
//# sourceMappingURL=update-profile.dto.js.map