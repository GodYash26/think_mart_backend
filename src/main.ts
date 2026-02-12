import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { checkDatabaseConnection } from './config/db-check';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  /* --------------------Check Database Connection-------------------- */
  await checkDatabaseConnection();

  /* --------------------Helmet Middleware-------------------- */
  app.use(helmet());

  /* --------------------Cookie Parser Middleware-------------------- */
  app.use(cookieParser());

  /* --------------------CORS Configuration-------------------- */
  const allowedOrigins = [
    'http://localhost:3000', // React frontend
    'http://localhost:3001', // Next.js frontend
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie'], // ✅ so frontend can read cookies if needed
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  /* --------------------Global Validation Pipe-------------------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle('ThinkMart API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}/api`);
}
bootstrap();
