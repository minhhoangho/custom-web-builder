import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import * as fs from 'fs';
import {QUEUE_NAMES} from '../constants';

@Processor(QUEUE_NAMES.FILE_OPERATION)
export class FileConsumer extends WorkerHost {
    async process(job: Job) {
        switch (job.name) {
            case 'delete-file':
                return this.deleteFileJob(job);
            default:
                break;
        }
    }

    async deleteFileJob(job: Job<unknown>) {
        const jobData: any = job.data;
        fs.unlinkSync(jobData.filePath);
    }
}
