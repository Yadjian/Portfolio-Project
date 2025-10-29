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
exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const meta_service_1 = require("./meta.service");
let MetaController = class MetaController {
    constructor(metaService) {
        this.metaService = metaService;
    }
    getRoles() {
        return this.metaService.getRoles();
    }
    getContractTypes() {
        return this.metaService.getContractTypes();
    }
    getExperienceLevels() {
        return this.metaService.getExperienceLevels();
    }
    getJobCategories() {
        return this.metaService.getJobCategories();
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('contract-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getContractTypes", null);
__decorate([
    (0, common_1.Get)('experience-levels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getExperienceLevels", null);
__decorate([
    (0, common_1.Get)('job-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getJobCategories", null);
exports.MetaController = MetaController = __decorate([
    (0, common_1.Controller)('meta'),
    __metadata("design:paramtypes", [meta_service_1.MetaService])
], MetaController);
//# sourceMappingURL=meta.controller.js.map