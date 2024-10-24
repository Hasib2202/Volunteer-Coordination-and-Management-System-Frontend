// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as session from 'express-session';
// // import { sessionConfig } from './config/session.config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   // app.useGlobalPipes(new ValidationPipe({
//   //   whitelist: true,
//   //   forbidNonWhitelisted: true,
//   //   transform: true,
//   // }));

//   app.use(
//     session({
//       secret: 'my-secret',
//       resave: false,
//       saveUninitialized: false,
//       cookie: { maxAge: 300000 } // 24 hours 60000 * 60 * 24 
//     }),
//   );
//   app.enableCors({
//     origin: '*', // Frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,  // If you need to send cookies or auth headers
//   });
//   app.enableCors();
//   // app.use(sessionConfig);  // Use session middleware
//   await app.listen(3000);
// }
// bootstrap();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/', // Serve files at the /uploads route
    });

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configure session middleware
  app.use(
    session({
      secret: 'my-secret', // Change this to a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 300000, httpOnly: true, secure: false }, // Set secure to true in production
    }),
  );

  // Configure CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow credentials (cookies) to be sent
  });
  // app.enableCors();

  await app.listen(3000);
}

bootstrap();
