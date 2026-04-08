import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  /**
   * Health Check Route
   * Checks the status of the application and the database connection.
   */
  @Get()
  async checkHealth() {
    try {
      // Try to execute a very simple and fast query on the database
      await this.prisma.$queryRaw`SELECT 1`;

      // If the query succeeds, everything is fine
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // If the query fails, the database connection is probably broken
      console.error('Health check failed:', error);
      throw new Error('Could not establish a connection to the database.');
    }
  }
}
