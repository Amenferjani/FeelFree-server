import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as session from 'express-session';

async function bootstrap() {
  const server = express();

  server.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  server.use('/uploads', express.static('uploads'));

  dotenv.config();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(csurf());
  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).send('Form tampered with');
    } else {
      next(err);
    }
  });
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API documentation for your project')
      .setVersion('1.0')
      .addTag('API')
      .build();
  
    try {
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document);
    } catch (error) {
      console.error('Error setting up Swagger:', error);
    }
  }
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`
        🚀 Server Status 🚀
       *********************
     *                       *
    *      PORT: ${port}         *
   *   🔧 Listening: Active    *
    *    🌟 Status: Ready      *
     *                       *
       *********************
              `);
}
bootstrap();
