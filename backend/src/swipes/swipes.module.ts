// src/swipes/swipes.module.ts
import { Module } from '@nestjs/common';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module'; // Ou PassportModule si tu l'utilises

@Module({
  imports: [PrismaModule, AuthModule], // Donne l'accès à Prisma et à l'AuthGuard
  controllers: [SwipesController],
  providers: [SwipesService],
})
export class SwipesModule {}
