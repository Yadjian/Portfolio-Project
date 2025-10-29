import { OnModuleInit } from '@nestjs/common';
export declare class FirebaseService implements OnModuleInit {
    private readonly logger;
    onModuleInit(): void;
    sendPushNotification(token: string, title: string, body: string, data?: {
        [key: string]: string;
    }): Promise<string>;
}
