"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const signup_dto_1 = require("./dto/signup.dto");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const { email, password, role } = dto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                },
            });
            if (role === signup_dto_1.UserRole.CANDIDATE) {
                await tx.candidateProfile.create({
                    data: {
                        userId: user.id,
                        firstName: '',
                        lastName: '',
                    },
                });
            }
            else if (role === signup_dto_1.UserRole.RECRUITER) {
                await tx.recruiterProfile.create({
                    data: {
                        userId: user.id,
                        firstName: '',
                        lastName: '',
                    },
                });
            }
            return user;
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
        return tokens;
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null,
                },
            },
            data: {
                hashedRefreshToken: null,
            },
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const tokensMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!tokensMatch)
            throw new common_1.ForbiddenException('Access Denied');
        const newTokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, newTokens.refreshToken);
        return newTokens;
    }
    async updateRefreshTokenHash(userId, refreshToken) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hash },
        });
    }
    async getTokens(userId, email) {
        const payload = {
            sub: userId,
            email,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map