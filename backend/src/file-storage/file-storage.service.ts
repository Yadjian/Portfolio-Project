// src/file-storage/file-storage.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des noms de fichiers uniques

@Injectable()
export class FileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME;

    this.s3Client = new S3Client({
      endpoint: `https://${process.env.R2_ENDPOINT}`,
      region: 'auto', // Important pour R2
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Téléverse un fichier sur R2 (S3).
   * @param file Le buffer du fichier (de multer)
   * @param folder Le dossier de destination (ex: 'resumes')
   * @returns L'URL publique du fichier
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    // Crée un nom de fichier unique pour éviter les conflits
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // Prépare la commande d'upload
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName, // Le chemin complet du fichier dans R2
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // R2 gère l'accès public via le bucket
    });

    // Envoie le fichier
    await this.s3Client.send(command);

    // TODO: Assure-toi que ton bucket R2 est configuré en "Accès public"
    // Retourne l'URL publique
    return `https://pub-b9b7f6ccf2824f88b6a79de85bf5c55c.r2.dev/${fileName}`; 
    // NOTE: Tu dois configurer un domaine public pour ton bucket R2
    // ou utiliser l'URL publique fournie par R2.
  }
}
