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
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
let FileStorageService = class FileStorageService {
    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME;
        this.s3Client = new client_s3_1.S3Client({
            endpoint: `https://${process.env.R2_ENDPOINT}`,
            region: 'auto',
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadFile(file, folder) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(command);
        const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
        return `${publicUrl}/${fileName}`;
    }
    async deleteFileByUrl(fileUrl) {
        if (!fileUrl)
            return;
        try {
            const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
            const fileName = fileUrl.replace(`${publicUrl}/`, '');
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            });
            await this.s3Client.send(command);
        }
        catch (error) {
            console.error('Error deleting file from R2:', error);
        }
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map