import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../features/jobs/constants';
import * as _ from 'lodash';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';

export class QueueAdapter {
  serverAdapter: ExpressAdapter;

  constructor() {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/admin/monitor/bull-board');
  }

  setupQueue(app: NestExpressApplication) {
    const queues: Queue[] = _.map(QUEUE_NAMES, (name) =>
      app.get<Queue>(`BullQueue_${name}`),
    );

    Logger.log(
      `Init dashboard UI for queues ${queues
        .map((queue) => queue.name)
        .join(',')}`,
    );
  }
}
