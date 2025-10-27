// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path'; // Pour gérer le chemin du fichier

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  onModuleInit() {
    try {
      // Chemin vers ton fichier de clé (adapte si nécessaire)
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin SDK Initialized Successfully.');
    } catch (error) {
      this.logger.error('Error initializing Firebase Admin SDK:', error);
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: { [key: string]: string }) {
    if (!token) {
      this.logger.warn('Attempted to send notification without a token.');
      return;
    }

    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      token: token, // Le push token de l'appareil de l'utilisateur
      data: data || {}, // Données supplémentaires (optionnel)
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message to token ${token}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to token ${token}:`, error);
      // TODO: Gérer les erreurs (ex: token invalide, supprimer de la BDD)
    }
  }
}
