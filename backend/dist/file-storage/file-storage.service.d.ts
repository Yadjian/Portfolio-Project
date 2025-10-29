export declare class FileStorageService {
    private readonly s3Client;
    private readonly bucketName;
    constructor();
    uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
    deleteFileByUrl(fileUrl: string): Promise<void>;
}
