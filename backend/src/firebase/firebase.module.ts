// src/firebase/firebase.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Rend le service disponible partout sans import explicite du module
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
