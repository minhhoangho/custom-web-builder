import { QUEUE_NAMES } from '../constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class FileProducer {
  constructor(@InjectQueue(QUEUE_NAMES.FILE_OPERATION) private queue: Queue) {}

  async deleteFile(fileName: string) {
    const filePath = `../${fileName}`;
    await this.queue.add('delete-file', {
      filePath,
    });
  }
}
