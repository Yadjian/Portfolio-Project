import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Imports pour Swagger
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  
  // Activer CORS
  app.enableCors();
  
  // 🔥 NOUVEAU: Activer la validation globale pour l'authentification
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Rejette les propriétés non autorisées
      transform: true,           // Transforme automatiquement les types
      disableErrorMessages: false, // Garde les messages d'erreur en développement
    })
  );
  
  // Logs temporaires
  console.log('Database URL:', process.env.DATABASE_URL);
  console.log('Redis URL:', process.env.REDIS_URL);
  console.log('JWT Access Secret Loaded:', !!process.env.JWT_ACCESS_SECRET);
  console.log('JWT Refresh Secret Loaded:', !!process.env.JWT_REFRESH_SECRET);
  console.log('Port:', process.env.PORT);

  // --- Configuration de Swagger ---
  const yamlPath = path.join(__dirname, '..', 'openapi.yml');
  
  // Vérifier si le fichier existe avant de le lire
  if (fs.existsSync(yamlPath)) {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const document = yaml.load(fileContents) as OpenAPIObject;
    SwaggerModule.setup('api', app, document);
    console.log(`Swagger UI is available on http://localhost:${port}/api`);
  } else {
    console.log('OpenAPI file not found, Swagger UI disabled');
  }
  // --- Fin du bloc Swagger ---

  // CORRECTION : Ajoute '0.0.0.0' pour écouter sur toutes les interfaces réseau
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
