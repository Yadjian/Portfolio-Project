import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- 1. IMPORTER PRISMA
import { AuthModule } from 'src/auth/auth.module'; // <-- 2. IMPORTER L'AUTH

@Module({
  imports: [
    PrismaModule, // <-- 3. L'AJOUTER ICI
    AuthModule,   // <-- 4. L'AJOUTER AUSSI (pour l'AuthGuard)
  ],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
