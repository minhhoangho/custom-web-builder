import { Deserializer, Serializer } from '@nestjs/microservices';
import {
  ConsumerConfig,
  KafkaConfig,
  ProducerConfig,
  ProducerRecord,
  Message,
  ConsumerRunConfig,
  Transaction,
  RecordMetadata,
  IHeaders,
} from 'kafkajs';
import { ModuleMetadata, Type } from '@nestjs/common';

// export interface IHeaders {
//   [key: string]: string | Buffer | number | boolean;
// }
export interface KafkaResponse {
  response: never;
  key: string;
  timestamp: string;
  offset: number;
  headers?: IHeaders;
}
export interface KafkaModuleOption {
  name: string;
  options: {
    client: KafkaConfig;
    consumer: ConsumerConfig;
    consumerRunConfig?: ConsumerRunConfig;
    producer?: ProducerConfig;
    deserializer?: Deserializer;
    serializer?: Serializer;
    consumeFromBeginning?: boolean;
    seek?: Record<string, number | 'earliest' | Date>;
    autoConnect?: boolean;
  };
}
export interface KafkaMessageObject extends Message {
  key: string | Buffer;
  value: string | Buffer;
}
export interface KafkaMessageSend extends Omit<ProducerRecord, 'topic'> {
  messages: KafkaMessageObject[];
  topic?: string;
}
export interface KafkaModuleOptionsAsync
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: never[];
  useExisting?: Type<KafkaOptionsFactory>;
  useClass?: Type<KafkaOptionsFactory>;
  useFactory?: (
    ...args: never[]
  ) => Promise<KafkaModuleOption[]> | KafkaModuleOption[];
}
export interface KafkaOptionsFactory {
  creatKafkaModuleOptions(): Promise<KafkaModuleOption[]> | KafkaModuleOption[];
}
export interface KafkaTransaction
  extends Omit<Transaction, 'send' | 'sendBatch'> {
  send(message: KafkaMessageSend): Promise<RecordMetadata[]>;
}
