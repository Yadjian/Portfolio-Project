import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import PrismaModule for database access
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule for authentication features

@Module({
  // Import required modules for matches features and authentication
  imports: [
    PrismaModule, // Enables database operations in the matches module
    AuthModule,   // Enables use of AuthGuard and authentication logic
  ],
  // Register the MatchesController to handle match-related routes
  controllers: [MatchesController],
  // Register the MatchesService to provide business logic for matches
  providers: [MatchesService]
})
export class MatchesModule {}
