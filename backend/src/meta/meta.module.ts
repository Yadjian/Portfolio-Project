import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // Import PrismaModule to enable database access for metadata queries
  imports: [PrismaModule],
  // Register the MetaController to handle metadata-related routes
  controllers: [MetaController],
  // Register the MetaService to provide business logic for metadata retrieval
  providers: [MetaService],
})
export class MetaModule {}
