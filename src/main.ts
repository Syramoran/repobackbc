import * as crypto from 'crypto';
(global as any).crypto = crypto;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // lanza error si llega algo no permitido
      transform: true, // convierte automáticamente los tipos (ej: string a number)
    }),
  );
  app.setGlobalPrefix('api')

  app.enableCors({
    origin: ['https://repobc.vercel.app', 'http://localhost:3000'], // Lista de orígenes permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos permitidos
    credentials: true, // Permitir cookies/enviar credenciales (si es necesario)
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With', // Cabeceras permitidas
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  
  console.log('URL DB:', process.env.DATABASE_URL);

  await app.listen(process.env.PORT ?? 3000);
  

}
bootstrap();
