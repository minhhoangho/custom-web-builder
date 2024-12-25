// import * as i18n from 'i18n';
// import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from '@app/app.module';
import { QueueAdapter } from './adapters';

import loadConfig from 'src/configs';

const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('This is the API document, contact us for detail')
      .addBearerAuth()
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('docs', app, document);
};

// const setupI18n = () => {
//   i18n.configure({
//     updateFiles: false,
//     locales: loadConfig.locale.supportedLocales,
//     defaultLocale: loadConfig.locale.default,
//     directory: path.join(__dirname, './common/locales/lang'),
//     register: global,
//     objectNotation: true,
//   });
//   i18n.setLocale(loadConfig.locale.default);
// };

async function bootstrap() {
  Logger.log('Booting server ....');
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: {
        credentials: true,
        origin: true,
        // allowedHeaders: ["app-key", "App-Key", 'Content-Type'] TODO: implement later
      },
    });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /* Setup Swagger" */
  setupSwagger(app);

  // config i18n
  // setupI18n();

  // Setup queue dashboard
  const queueAdapter = new QueueAdapter();
  queueAdapter.setupQueue(app);

  await app.listen(loadConfig.rest.port);

  Logger.log(
    `Server running on http://localhost:${loadConfig.rest.port}`,
    'Bootstrap',
  );
}

bootstrap();
