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
exports.UpdateLocationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateLocationDto {
}
exports.UpdateLocationDto = UpdateLocationDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom de lieu doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de lieu est obligatoire' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Le nom de lieu est trop long (max 255 caractères)' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateLocationDto.prototype, "locationName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Les coordonnées doivent être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Les coordonnées sont obligatoires' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Les coordonnées sont trop longues (max 500 caractères)' }),
    (0, class_validator_1.ValidateIf)((o) => o.locationWKT && o.locationWKT.length > 0),
    (0, class_validator_1.Matches)(/^POINT\s*\(\s*-?\d+\.?\d*\s+-?\d+\.?\d*\s*\)$/i, {
        message: 'Format de coordonnées invalide. Exemple: POINT(2.3522 48.8566)'
    }),
    __metadata("design:type", String)
], UpdateLocationDto.prototype, "locationWKT", void 0);
//# sourceMappingURL=update-location.dto.js.map