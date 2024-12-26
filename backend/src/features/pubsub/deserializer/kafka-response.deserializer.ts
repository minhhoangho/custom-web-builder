import { Deserializer } from '@nestjs/microservices';
import { KafkaMessageObject, KafkaResponse } from '../kafka.interfaces';
import { IHeaders, KafkaMessage } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { toNumber } from 'lodash';
import { JSONObject } from '@common/types';

export class KafkaResponseDeserializer<T>
  implements Deserializer<JSONObject, KafkaMessageObject>
{
  deserialize(
    message: KafkaMessage,
    _options?: Record<string, JSONObject>,
  ): KafkaResponse {
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
      response,
      timestamp,
      offset: toNumber(offset) as number,
      headers: headers as IHeaders,
    };
  }
}
