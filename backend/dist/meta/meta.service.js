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
exports.MetaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let MetaService = class MetaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getRoles() {
        return [
            { value: 'candidate', label: 'Candidat' },
            { value: 'recruiter', label: 'Recruteur' },
            { value: 'admin', label: 'Administrateur' },
        ];
    }
    getContractTypes() {
        return Object.values(client_1.ContractType).map(value => ({
            value,
            label: this.getContractTypeLabel(value),
        }));
    }
    getExperienceLevels() {
        return Object.values(client_1.ExperienceLevel).map(value => ({
            value,
            label: this.getExperienceLevelLabel(value),
        }));
    }
    async getJobCategories() {
        return this.prisma.jobCategory.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    getContractTypeLabel(type) {
        const labels = {
            [client_1.ContractType.CDI]: 'CDI',
            [client_1.ContractType.CDD]: 'CDD',
            [client_1.ContractType.ALTERNANCE]: 'Alternance',
            [client_1.ContractType.STAGE]: 'Stage',
            [client_1.ContractType.FREELANCE]: 'Freelance',
            [client_1.ContractType.AUTRE]: 'Autre',
        };
        return labels[type] || type;
    }
    getExperienceLevelLabel(level) {
        const labels = {
            [client_1.ExperienceLevel.DEBUTANT]: 'Débutant',
            [client_1.ExperienceLevel.INTERMEDIAIRE]: 'Intermédiaire',
            [client_1.ExperienceLevel.CONFIRME]: 'Confirmé',
        };
        return labels[level] || level;
    }
};
exports.MetaService = MetaService;
exports.MetaService = MetaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetaService);
//# sourceMappingURL=meta.service.js.map