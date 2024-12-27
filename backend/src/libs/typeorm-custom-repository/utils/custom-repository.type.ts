import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository as TypeOrmRepository,
} from 'typeorm';
import { AnyObject } from '@common/interfaces';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Repository extends Function {
  new (
    target: EntityTarget<AnyObject>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ): TypeOrmRepository<ObjectLiteral>;
}
