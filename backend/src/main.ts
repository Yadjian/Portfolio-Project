import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Log temporaire pour vérifier les variables d'environnement
  console.log('Database URL:', process.env.DATABASE_URL);
  console.log('Redis URL:', process.env.REDIS_URL);
  console.log('JWT Secret:', process.env.JWT_SECRET);
  console.log('Port:', process.env.PORT);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
