import { QUEUE_NAMES } from '../constants';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

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
