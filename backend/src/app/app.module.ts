import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { typeOrmConfig } from 'src/database/typeorm.config';
import loadConfig from 'src/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionHandler } from 'src/errors/base.handler.error';
import { MappingError } from 'src/errors/mapping.error';
// import { AppSentry } from '@common/third_parties';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { LoggingMiddleware } from '@common/middlewares/logging.middleware';
import { JobModule } from '../features/jobs/jobs.module';
import { UOWModule } from '@common/uow/uow.module';
import { RedisCacheModule } from '@providers/cache/cache.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { DrawDBModule } from "@app/drawdb/drawdb.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UOWModule,
    JobModule,
    RedisCacheModule,
    HealthCheckModule,
    RoleModule,
    UserModule,
    AuthModule,
    DrawDBModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: loadConfig.mail.user,
          pass: loadConfig.mail.pass,
        },
      },
      defaults: {
        from: 'SYSTEM admin" <noreply.system-admin@gmail.com>',
      },
      template: {
        dir: `${process.cwd()}/src/third-parties/mail/templates/`,
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    CategoryModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    MappingError,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
