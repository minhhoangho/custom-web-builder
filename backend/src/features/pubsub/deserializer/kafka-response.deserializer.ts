import { Deserializer } from '@nestjs/microservices';
import { KafkaResponse } from '../kafka.interfaces';

export class KafkaResponseDeserializer
  implements Deserializer<any, KafkaResponse>
{
  deserialize(message: any, _options?: Record<string, any>): KafkaResponse {
    const { key, value, timestamp, offset, headers } = message;
    let id = key;
    let response = value;

    if (Buffer.isBuffer(key)) {
      id = Buffer.from(key).toString();
    }

    if (Buffer.isBuffer(value)) {
      response = Buffer.from(value).toString();
    }

    Object.keys(headers).forEach((headerKey) => {
      if (Buffer.isBuffer(headers[headerKey])) {
        headers[headerKey] = Buffer.from(headers[headerKey]).toString();
      }
    });

    return {
      key: id,
      response,
      timestamp,
      offset,
      headers,
    };
  }
}
