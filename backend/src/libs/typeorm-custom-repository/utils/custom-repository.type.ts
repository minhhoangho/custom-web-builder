import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { JSONObject } from '@common/types';

export interface Repository extends Function {
  new (
    target: EntityTarget<JSONObject>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ): TypeOrmRepository<ObjectLiteral>;
}
