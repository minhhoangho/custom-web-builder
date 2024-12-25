import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAMES } from '../constants';

@Processor(QUEUE_NAMES.MAIL)
export class MailConsumer {
  @Process('send-mail')
  async sendMail(_job: Job) {
    console.log('Mail consumer ---> Sending mail ...');
  }
}
