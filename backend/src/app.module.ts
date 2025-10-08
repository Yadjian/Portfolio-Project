// Fichier: backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [AuthModule, PrismaModule, CompaniesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}