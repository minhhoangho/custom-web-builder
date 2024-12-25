import {map} from 'lodash';

import {BullModule} from '@nestjs/bullmq';
import {Module} from '@nestjs/common';

import loadConfig from '../../configs';

import {BullService} from './bull.service';
import {MailProducer} from './producers/mail.producer';
import {MailConsumer} from './consumers/mail.consumer';
import {QUEUE_NAMES} from './constants';
import {BullBoardModule} from "@bull-board/nestjs";
import {ExpressAdapter} from "@bull-board/express";

/**
 *  Abstracting each queue using modules.
 *  Importing queues into other modules.
 *  Using Bull UI for realtime tracking of queues.
 */

@Module({
    controllers: [],
    imports: [
        BullModule.forRoot({
            connection: {
                host: loadConfig.redis.host,
                port: loadConfig.redis.port,
            }
        }),
        ...map(QUEUE_NAMES, (name) =>
            BullModule.registerQueue({
                prefix: loadConfig.queue.prefix,
                name,
                // defaultJobOptions: {
                //   removeOnComplete: true,
                //   removeOnFail: true
                // },

            }),
        ),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter // Or FastifyAdapter from `@bull-board/fastify`
        }),
    ],
    providers: [BullService, MailConsumer, MailProducer],
    exports: [MailProducer],
})
export class JobModule {
}
