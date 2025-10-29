// This file defines the FileStorageModule, which bundles all file storage related components and dependencies.

import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Module({
  // Register the FileStorageService as a provider for dependency injection
  providers: [FileStorageService],
  // Export the FileStorageService so it can be used in other modules
  exports: [FileStorageService], // <-- Export it for use in other modules!
})
export class FileStorageModule {}