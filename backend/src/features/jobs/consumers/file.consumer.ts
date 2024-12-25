import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import { QUEUE_NAMES } from '../constants';

@Processor(QUEUE_NAMES.FILE_OPERATION)
export class FileConsumer {
  @Process('delete-file')
  async deleteFileJob(job: Job<unknown>) {
    const jobData: any = job.data;
    fs.unlinkSync(jobData.filePath);
  }
}
