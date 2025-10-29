"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const health_controller_1 = require("./health/health.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const profile_module_1 = require("./profile/profile.module");
const job_offer_module_1 = require("./job-offer/job-offer.module");
const companies_module_1 = require("./companies/companies.module");
const meta_module_1 = require("./meta/meta.module");
const discovery_module_1 = require("./discovery/discovery.module");
const swipes_module_1 = require("./swipes/swipes.module");
const matches_module_1 = require("./matches/matches.module");
const file_storage_module_1 = require("./file-storage/file-storage.module");
const admin_module_1 = require("./admin/admin.module");
const platform_express_1 = require("@nestjs/platform-express");
const bullmq_1 = require("@nestjs/bullmq");
const notifications_module_1 = require("./notifications/notifications.module");
const firebase_module_1 = require("./firebase/firebase.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: 'redis',
                    port: 6379,
                },
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            profile_module_1.ProfileModule,
            swipes_module_1.SwipesModule,
            job_offer_module_1.JobOfferModule,
            companies_module_1.CompaniesModule,
            meta_module_1.MetaModule,
            discovery_module_1.DiscoveryModule,
            matches_module_1.MatchesModule,
            file_storage_module_1.FileStorageModule,
            admin_module_1.AdminModule,
            notifications_module_1.NotificationsModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            firebase_module_1.FirebaseModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60000,
                    limit: 10,
                },
                {
                    name: 'auth',
                    ttl: 900000,
                    limit: 5,
                },
            ]),
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [app_service_1.AppService, {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map