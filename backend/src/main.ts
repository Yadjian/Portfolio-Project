import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Chargement conditionnel du fichier d'environnement
if (fs.existsSync('.env.local') && !process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
  console.log('✅ Loaded environment from .env.local');
} else if (fs.existsSync('.env') && !process.env.DATABASE_URL) {
  dotenv.config({ path: '.env' });
  console.log('✅ Loaded environment from .env');
}

// Imports pour Swagger
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as path from 'path'; // <- L'import crucial qui manquait

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS
  app.enableCors();
  
  // Logs temporaires
  console.log('Database URL:', process.env.DATABASE_URL);
  console.log('Redis URL:', process.env.REDIS_URL);
  console.log('JWT Secret:', process.env.JWT_SECRET);
  console.log('Port:', process.env.PORT);

  // --- Configuration de Swagger ---

  // Construit un chemin fiable vers openapi.yml à la racine du dossier backend
  const yamlPath = path.join(__dirname, '..', 'openapi.yml');
  const fileContents = fs.readFileSync(yamlPath, 'utf8');

  // Convertir le contenu YAML en objet JavaScript avec l'assertion de type
  const document = yaml.load(fileContents) as OpenAPIObject;

  SwaggerModule.setup('api', app, document);
  // --- Fin du bloc Swagger ---

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI is available on http://localhost:${port}/api`);
}
bootstrap();
