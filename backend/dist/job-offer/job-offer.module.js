"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOfferModule = void 0;
const common_1 = require("@nestjs/common");
const job_offer_controller_1 = require("./job-offer.controller");
const job_offer_service_1 = require("./job-offer.service");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
let JobOfferModule = class JobOfferModule {
};
exports.JobOfferModule = JobOfferModule;
exports.JobOfferModule = JobOfferModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [job_offer_controller_1.JobOffersController],
        providers: [job_offer_service_1.JobOfferService]
    })
], JobOfferModule);
//# sourceMappingURL=job-offer.module.js.map