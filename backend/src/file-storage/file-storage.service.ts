// src/file-storage/file-storage.service.ts
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME;

    this.s3Client = new S3Client({
      endpoint: `https://${process.env.R2_ENDPOINT}`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Uploads a file to R2 (S3).
   * @param file The file buffer (from multer)
   * @param folder The destination folder (e.g., 'resumes')
   * @returns The public URL of the file
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    // Send the file
    await this.s3Client.send(command);

    // Build the public URL from environment variables or use the default value
    const publicUrl =
      process.env.R2_PUBLIC_URL ||
      'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
    return `${publicUrl}/${fileName}`;
  }

  /**
  * Deletes a file from R2 using its URL.
  * @param fileUrl The full URL of the file to delete
  */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      // Extract the file name (key) from the URL
      const publicUrl =
        process.env.R2_PUBLIC_URL ||
        'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
      const fileName = fileUrl.replace(`${publicUrl}/`, '');

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.s3Client.send(command);
      console.log(`Fichier supprimé de R2: ${fileName}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier R2:', error);
    }
  }
}
