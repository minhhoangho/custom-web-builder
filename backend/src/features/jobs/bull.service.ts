import * as _ from 'lodash';

import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {getQueueToken} from '@nestjs/bullmq';
import {Queue} from 'bullmq';

import {QUEUE_NAMES} from './constants';

@Injectable()
export class BullService implements OnModuleInit {
    public queues: Queue[] = [];

    constructor(private readonly moduleRef: ModuleRef) {
    }

    onModuleInit(): any {
        this.queues = _.map(QUEUE_NAMES, (name) =>
            this.moduleRef.get(getQueueToken(name), {strict: false}),
        );

        this.queues.forEach((queue) => {
            Logger.log(`Queue ${queue.name} initialized successfully`, 'BullService');
        });
    }
}
