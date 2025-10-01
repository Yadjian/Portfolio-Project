import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  /**
   * Route de Health Check
   * Vérifie l'état de l'application et la connexion à la base de données.
   */
  @Get()
  async checkHealth() {
    try {
      // Tente d'exécuter une requête simple et très rapide sur la DB
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Si la requête réussit, tout va bien
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Si la requête échoue, la connexion à la DB est probablement rompue
      console.error('Health check failed:', error);
      throw new Error('Could not establish a connection to the database.');
    }
  }
}