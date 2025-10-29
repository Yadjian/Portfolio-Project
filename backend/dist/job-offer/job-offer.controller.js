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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOffersController = void 0;
const common_1 = require("@nestjs/common");
const job_offer_service_1 = require("./job-offer.service");
const create_job_offer_dto_1 = require("./dto/create-job-offer.dto");
const passport_1 = require("@nestjs/passport");
const update_job_offer_dto_1 = require("./dto/update-job-offer.dto");
let JobOffersController = class JobOffersController {
    constructor(jobOfferService) {
        this.jobOfferService = jobOfferService;
    }
    create(createJobOfferDto, req) {
        const user = req.user;
        const userId = user.sub;
        return this.jobOfferService.create(createJobOfferDto, userId);
    }
    findAll() {
        return this.jobOfferService.findAll();
    }
    findMyOffers(req) {
        const user = req.user;
        const userId = user.sub;
        return this.jobOfferService.findAllByRecruiter(userId);
    }
    findOne(id) {
        return this.jobOfferService.findOne(id);
    }
    update(id, req, updateJobOfferDto) {
        const user = req.user;
        return this.jobOfferService.update(id, user.sub, updateJobOfferDto);
    }
    remove(id, req) {
        const user = req.user;
        return this.jobOfferService.remove(id, user.sub);
    }
};
exports.JobOffersController = JobOffersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_offer_dto_1.CreateJobOfferDto, Object]),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-offers'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "findMyOffers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_job_offer_dto_1.UpdateJobOfferDto]),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobOffersController.prototype, "remove", null);
exports.JobOffersController = JobOffersController = __decorate([
    (0, common_1.Controller)('job-offers'),
    __metadata("design:paramtypes", [job_offer_service_1.JobOfferService])
], JobOffersController);
//# sourceMappingURL=job-offer.controller.js.map