import { map } from 'lodash';

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import loadConfig from '../../configs';

import { BullService } from './bull.service';
import { MailProducer } from './producers/mail.producer';
import { MailConsumer } from './consumers/mail.consumer';
import { QUEUE_NAMES } from './constants';

/**
 *  Abstracting each queue using modules.
 *  Importing queues into other modules.
 *  Using Bull UI for realtime tracking of queues.
 */

@Module({
  controllers: [],
  imports: [
    BullModule.forRoot({
      redis: {
        host: loadConfig.redis.host,
        port: loadConfig.redis.port,
      },
    }),
    ...map(QUEUE_NAMES, (name) =>
      BullModule.registerQueue({
        prefix: loadConfig.queue.prefix,
        name,
        // defaultJobOptions: {
        //   removeOnComplete: true,
        //   removeOnFail: true
        // },
        settings: {
          lockDuration: 300000,
        },
      }),
    ),
  ],
  providers: [BullService, MailConsumer, MailProducer],
  exports: [MailProducer],
})
export class JobModule {}
