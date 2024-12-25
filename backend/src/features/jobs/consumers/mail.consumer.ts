import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {QUEUE_NAMES} from '../constants';

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
        console.log('Mail consumer ---> Sending mail ...');
    }
}
