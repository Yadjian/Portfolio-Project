"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = exports.MATCH_NOTIFICATION_QUEUE = exports.SWIPE_NOTIFICATION_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_1 = require("../prisma/prisma.module");
const firebase_module_1 = require("../firebase/firebase.module");
const notifications_processor_1 = require("./notifications.processor");
exports.SWIPE_NOTIFICATION_QUEUE = 'swipe-notification';
exports.MATCH_NOTIFICATION_QUEUE = 'match-notification';
const redisOptions = {
    host: 'redis',
    port: 6379,
};
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, firebase_module_1.FirebaseModule,
            bullmq_1.BullModule.registerQueue({
                name: exports.SWIPE_NOTIFICATION_QUEUE,
            }),
            bullmq_1.BullModule.registerQueue({
                name: exports.MATCH_NOTIFICATION_QUEUE,
            }),
        ],
        providers: [
            notifications_processor_1.SwipeNotificationsProcessor,
            notifications_processor_1.MatchNotificationsProcessor,
        ],
        exports: [bullmq_1.BullModule],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map