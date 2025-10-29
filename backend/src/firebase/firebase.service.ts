// This service wraps Firebase Admin SDK functionality for use in the NestJS application.

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path'; // Used to resolve the path to the service account file

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  // Called automatically when the module is initialized
  onModuleInit() {
    try {
      // Path to your Firebase service account key file (adjust if needed)
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');

      // Initialize the Firebase Admin SDK with the service account credentials
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin SDK Initialized Successfully.');
    } catch (error) {
      this.logger.error('Error initializing Firebase Admin SDK:', error);
    }
  }

  /**
   * Sends a push notification to a device using Firebase Cloud Messaging.
   * @param token The device's push token
   * @param title The notification title
   * @param body The notification body
   * @param data Optional additional data to include in the notification
   */
  async sendPushNotification(token: string, title: string, body: string, data?: { [key: string]: string }) {
    if (!token) {
      this.logger.warn('Attempted to send notification without a token.');
      return;
    }

    // Construct the message payload for FCM
    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      token: token, // The user's device push token
      data: data || {}, // Optional additional data
    };

    try {
      // Send the notification using Firebase Admin SDK
      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message to token ${token}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to token ${token}:`, error);
      // TODO: Handle errors (e.g., invalid token, remove from DB)
    }
  }
}
