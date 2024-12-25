import { QUEUE_NAMES } from '../constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue(QUEUE_NAMES.MAIL) private queue: Queue) {}

  async sendMail(title: string) {
    console.log('Producer send mail >>> ', title);
    await this.queue.add('send-mail', {
      title,
    });
  }
}
