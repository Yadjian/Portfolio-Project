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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const file_storage_service_1 = require("../file-storage/file-storage.service");
let ProfileService = class ProfileService {
    constructor(prisma, fileStorageService) {
        this.prisma = prisma;
        this.fileStorageService = fileStorageService;
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                candidateProfile: {
                    include: {
                        interestedInCategories: true,
                    }
                },
                recruiterProfile: {
                    include: {
                        searchedCategories: true,
                        memberships: {
                            include: {
                                company: true,
                            },
                        },
                    },
                }
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        return user;
    }
    async updateUserProfile(userId, data, photoFile) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true, recruiterProfile: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        let photoUrlData = {};
        if (photoFile) {
            const url = await this.fileStorageService.uploadFile(photoFile, 'profile-photos');
            photoUrlData = { photoUrl: url };
        }
        if (user.recruiterProfile) {
            const { interestedInCategoryIds, ...restOfData } = data;
            const dataToUpdate = { ...restOfData, ...photoUrlData };
            delete dataToUpdate.coverLetterText;
            await this.prisma.recruiterProfile.update({
                where: { id: user.recruiterProfile.id },
                data: {
                    ...dataToUpdate,
                    searchedCategories: {
                        set: interestedInCategoryIds?.map((id) => ({ id })),
                    },
                },
                include: { searchedCategories: true },
            });
        }
        else if (user.candidateProfile) {
            const { interestedInCategoryIds, ...restOfData } = data;
            const dataToUpdate = { ...restOfData, ...photoUrlData };
            await this.prisma.candidateProfile.update({
                where: { id: user.candidateProfile.id },
                data: {
                    ...dataToUpdate,
                    interestedInCategories: {
                        set: interestedInCategoryIds?.map((id) => ({ id })),
                    },
                },
                include: { interestedInCategories: true },
            });
        }
        return this.getUserProfile(userId);
    }
    async updateUserLocation(userId, locationDto) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { candidateProfile: true },
        });
        if (!user.candidateProfile) {
            throw new common_1.NotFoundException('Candidate profile not found for this user.');
        }
        const { locationName, locationWKT } = locationDto;
        try {
            await this.prisma.$executeRaw `SELECT ST_GeomFromText(${locationWKT}, 4326)`;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid GPS coordinates');
        }
        return this.prisma.candidateProfile.update({
            where: { id: user.candidateProfile.id },
            data: { locationWKT, locationName },
        });
    }
    async updateRecruiterLocation(userId, locationDto) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { recruiterProfile: true },
        });
        if (!user.recruiterProfile) {
            throw new common_1.NotFoundException('Recruiter profile not found for this user.');
        }
        const { locationName, locationWKT } = locationDto;
        return this.prisma.recruiterProfile.update({
            where: { id: user.recruiterProfile.id },
            data: { locationWKT, locationName },
        });
    }
    async updateProfile(userId, dto, photoFile) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true, recruiterProfile: true },
        });
        let profileModel;
        let profileId;
        let oldPhotoUrl = null;
        if (user.candidateProfile) {
            profileModel = this.prisma.candidateProfile;
            profileId = user.candidateProfile.id;
            oldPhotoUrl = user.candidateProfile.photoUrl;
        }
        else if (user.recruiterProfile) {
            profileModel = this.prisma.recruiterProfile;
            profileId = user.recruiterProfile.id;
            oldPhotoUrl = user.recruiterProfile.photoUrl;
        }
        else {
            throw new common_1.NotFoundException('Profile not found.');
        }
        let photoUrlData = {};
        if (photoFile) {
            const url = await this.fileStorageService.uploadFile(photoFile, 'profile-photos');
            photoUrlData = { photoUrl: url };
            if (oldPhotoUrl) {
                await this.fileStorageService.deleteFileByUrl(oldPhotoUrl);
            }
        }
        let categoriesData = {};
        if (dto.interestedInCategoryIds) {
            const categoryField = user.candidateProfile ? 'interestedInCategories' : 'searchedCategories';
            categoriesData = {
                [categoryField]: {
                    set: dto.interestedInCategoryIds.map(id => ({ id: id })),
                },
            };
            delete dto.interestedInCategoryIds;
        }
        return profileModel.update({
            where: { id: profileId },
            data: {
                ...dto,
                ...photoUrlData,
                ...categoriesData,
            },
        });
    }
    async getJobCategories() {
        return this.prisma.jobCategory.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: 'asc' }
        });
    }
    async updateProfilePhoto(userId, photoFile) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true, recruiterProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        let oldPhotoUrl = null;
        if (user.candidateProfile) {
            oldPhotoUrl = user.candidateProfile.photoUrl;
        }
        else if (user.recruiterProfile) {
            oldPhotoUrl = user.recruiterProfile.photoUrl;
        }
        const photoUrl = await this.fileStorageService.uploadFile(photoFile, 'profile-photos');
        if (user.candidateProfile) {
            await this.prisma.candidateProfile.update({
                where: { id: user.candidateProfile.id },
                data: { photoUrl },
            });
        }
        else if (user.recruiterProfile) {
            await this.prisma.recruiterProfile.update({
                where: { id: user.recruiterProfile.id },
                data: { photoUrl },
            });
        }
        else {
            throw new common_1.NotFoundException('Profile not found.');
        }
        if (oldPhotoUrl) {
            await this.fileStorageService.deleteFileByUrl(oldPhotoUrl);
        }
        return { photoUrl };
    }
    async updateResume(userId, file) {
        const profile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Candidate profile not found.');
        }
        const fileUrl = await this.fileStorageService.uploadFile(file, 'resumes');
        if (profile.resumeUrl) {
            await this.fileStorageService.deleteFileByUrl(profile.resumeUrl);
        }
        const updatedProfile = await this.prisma.candidateProfile.update({
            where: { id: profile.id },
            data: {
                resumeUrl: fileUrl,
            },
        });
        return {
            message: 'Resume updated successfully.',
            resumeUrl: updatedProfile.resumeUrl,
        };
    }
    async deleteResume(userId) {
        const profile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Candidate profile not found.');
        }
        if (profile.resumeUrl) {
            await this.fileStorageService.deleteFileByUrl(profile.resumeUrl);
        }
        await this.prisma.candidateProfile.update({
            where: { id: profile.id },
            data: {
                resumeUrl: null,
            },
        });
        return {
            message: 'Resume deleted successfully.',
        };
    }
    async updatePushToken(userId, token) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: true, recruiterProfile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (user.candidateProfile) {
            return this.prisma.candidateProfile.update({ where: { userId }, data: { pushToken: token } });
        }
        else if (user.recruiterProfile) {
            return this.prisma.recruiterProfile.update({ where: { userId }, data: { pushToken: token } });
        }
        throw new common_1.NotFoundException('Profile not found.');
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_storage_service_1.FileStorageService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map