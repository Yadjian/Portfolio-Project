// This service handles file upload and deletion operations using Cloudflare R2 (S3-compatible storage).

import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Used to generate unique file names

@Injectable()
export class FileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    // Get the bucket name from environment variables
    this.bucketName = process.env.R2_BUCKET_NAME;

    // Initialize the S3 client for R2 with credentials and endpoint from environment variables
    this.s3Client = new S3Client({
      endpoint: `https://${process.env.R2_ENDPOINT}`,
      region: 'auto', // 'auto' is required for Cloudflare R2
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Uploads a file to R2 (S3-compatible storage).
   * @param file The file buffer (from multer)
   * @param folder The destination folder (e.g., 'resumes')
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    // Generate a unique file name to avoid conflicts
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // Prepare the upload command for S3
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName, // Full path of the file in R2
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // R2 manages public access at the bucket level
    });

    // Send the file to R2
    await this.s3Client.send(command);

    // Build the public URL using the environment variable or a default value
    const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
    return `${publicUrl}/${fileName}`;
  }

  /**
   * Deletes a file from R2 using its public URL.
   * @param fileUrl The full public URL of the file to delete
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      // Extract the file key from the public URL
      const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev';
      const fileName = fileUrl.replace(`${publicUrl}/`, '');

      // Prepare the delete command for S3
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      // Send the delete command to R2
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      // Do not throw error to avoid blocking profile updates
    }
  }
}
