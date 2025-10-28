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
  
  // 🌐 CORS - Votre config existante maintenue
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || []
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
  
  // 🔒 VALIDATION PROGRESSIVE - Sécurisée mais NON-CASSANTE
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                    // ✅ Supprime les champs malveillants
      forbidNonWhitelisted: false,        // 🔄 Ignore les champs inconnus (COMPATIBLE FRONTEND)
      transform: true,                    // ✅ Transformations automatiques
      skipUndefinedProperties: true,      // ✅ Ignore les undefined
      skipNullProperties: false,          // ✅ Valide les null
      skipMissingProperties: false,       // ✅ Valide les champs requis
      disableErrorMessages: false,        // ✅ Messages d'erreur détaillés
      validateCustomDecorators: true,     // ✅ Validation avancée
      transformOptions: {
        enableImplicitConversion: true,   // ✅ Conversion automatique des types
      },
    })
  );
  
  // 📊 VOS LOGS EXISTANTS - inchangés
  console.log('Database URL:', process.env.DATABASE_URL);
  console.log('Redis URL:', process.env.REDIS_URL);
  console.log('JWT Access Secret Loaded:', !!process.env.JWT_ACCESS_SECRET);
  console.log('JWT Refresh Secret Loaded:', !!process.env.JWT_REFRESH_SECRET);
  console.log('Port:', process.env.PORT);

  // 📚 VOTRE CONFIG SWAGGER EXISTANTE - inchangée
  const yamlPath = path.join(__dirname, '..', 'openapi.yml');
  
  if (fs.existsSync(yamlPath)) {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const document = yaml.load(fileContents) as OpenAPIObject;
    SwaggerModule.setup('api', app, document);
    console.log(`Swagger UI is available on http://localhost:${port}/api`);
  } else {
    console.log('OpenAPI file not found, Swagger UI disabled');
  }

  // 🚀 VOTRE DÉMARRAGE EXISTANT - inchangé
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on http://localhost:${port}`);
  console.log('🔒 Progressive validation enabled (frontend-compatible)');
}
bootstrap();
