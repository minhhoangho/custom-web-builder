import { Deserializer } from '@nestjs/microservices';
import { KafkaMessageObject, KafkaResponse } from '../kafka.interfaces';
import { IHeaders, KafkaMessage } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { toNumber } from 'lodash';

export class KafkaResponseDeserializer<T>
  implements Deserializer<any, KafkaMessageObject>
{
  deserialize(
    message: KafkaMessage,
    _options?: Record<string, any>,
  ): KafkaResponse<T> {
    const { key, value, timestamp, offset, headers } = message;
    let id: string | Buffer | null = key;
    let response: string | unknown = value;

    if (Buffer.isBuffer(key)) {
      id = Buffer.from(key).toString();
    } else {
      id = '';
      Logger.error('Key is not a buffer');
    }

    if (Buffer.isBuffer(value)) {
      response = Buffer.from(value).toString();
    }

    Object.keys(headers ?? {}).forEach((headerKey) => {
      if (Buffer.isBuffer(!headers || headers[headerKey])) {
        headers[headerKey] = Buffer.from(headers[headerKey]).toString();
      }
    });

    return {
      key: id,
      response: response as T,
      timestamp,
      offset: toNumber(offset) as number,
      headers: headers as IHeaders,
    };
  }
}
