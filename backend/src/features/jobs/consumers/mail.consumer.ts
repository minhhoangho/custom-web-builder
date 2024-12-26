import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../constants';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAMES.MAIL)
export class MailConsumer extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case 'send-mail':
        return this.sendMail(job);
      default:
        break;
    }
  }

  async sendMail(_job: Job) {
    Logger.log('Mail consumer ---> Sending mail ...');
  }
}
