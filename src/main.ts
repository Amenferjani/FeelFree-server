import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  
  if(process.env.NODE_ENV === 'DEV'){
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation for your project')
    .setVersion('1.0')
    .addTag('API')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); 
}
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(8080);
  console.log(`
        🚀 Server Status 🚀
       *********************
     *                       *
    *      PORT: 8080         *
   *   🔧 Listening: Active    *
    *    🌟 Status: Ready      *
     *                       *
       *********************
              `);

}
bootstrap();
