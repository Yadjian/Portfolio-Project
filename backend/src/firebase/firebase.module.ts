// This file defines the FirebaseModule, which provides the FirebaseService for use throughout the application.

import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Makes the service globally available without needing to import the module in every feature module
@Module({
  // Register the FirebaseService as a provider for dependency injection
  providers: [FirebaseService],
  // Export the FirebaseService so it can be injected into other modules
  exports: [FirebaseService],
})
export class FirebaseModule {}
