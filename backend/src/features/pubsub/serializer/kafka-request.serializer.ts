import {
  isNil,
  isPlainObject,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { Serializer } from '@nestjs/microservices';

export interface KafkaRequest<T> {
  key: Buffer | string | null;
  value: T;
  topic: string;
  headers: Record<string, string | number | boolean>;
}

export class KafkaRequestSerializer<T>
  implements Serializer<string | number | boolean, KafkaRequest<T>>
{
  serialize(value): KafkaRequest<T> {
    return value;
  }

  public encode(value): Buffer | string | null {
    const isObjectOrArray =
      !isNil(value) && !isString(value) && !Buffer.isBuffer(value);

    if (isObjectOrArray) {
      return isPlainObject(value) || Array.isArray(value)
        ? JSON.stringify(value)
        : value.toString();
    } else if (isUndefined(value)) {
      return null;
    }
    return value;
  }
}
