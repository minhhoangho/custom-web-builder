import { Module } from '@nestjs/common';
import { MailerProvider } from './mailer.provider';

@Module({
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class CustomMailerModule {}
