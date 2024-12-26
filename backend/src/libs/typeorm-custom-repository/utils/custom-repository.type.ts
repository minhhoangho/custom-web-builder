import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { JSONObject } from '@common/types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Repository extends Function {
  new (
    target: EntityTarget<JSONObject>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ): TypeOrmRepository<ObjectLiteral>;
}
