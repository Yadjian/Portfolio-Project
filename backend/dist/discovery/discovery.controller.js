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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const discovery_service_1 = require("./discovery.service");
let DiscoveryController = class DiscoveryController {
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    getRecruiterDiscoveryDeck(req, radius, latitude, longitude) {
        const user = req.user;
        const userId = user.sub;
        const coords = latitude && longitude ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        } : undefined;
        return this.discoveryService.getRecruitersForCandidate(userId, radius, coords);
    }
    getCandidateDiscoveryDeck(req, radius, latitude, longitude) {
        const user = req.user;
        const userId = user.sub;
        const coords = latitude && longitude ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        } : undefined;
        return this.discoveryService.getCandidatesForRecruiter(userId, radius, coords);
    }
    getPendingCandidates(req) {
        const user = req.user;
        const userId = user.sub;
        return this.discoveryService.getPendingCandidatesForRecruiter(userId);
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('recruiters'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('radius', new common_1.DefaultValuePipe(20000), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('latitude')),
    __param(3, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getRecruiterDiscoveryDeck", null);
__decorate([
    (0, common_1.Get)('candidates'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('radius', new common_1.DefaultValuePipe(20000), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('latitude')),
    __param(3, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getCandidateDiscoveryDeck", null);
__decorate([
    (0, common_1.Get)('pending-candidates'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getPendingCandidates", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, common_1.Controller)('discovery'),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map