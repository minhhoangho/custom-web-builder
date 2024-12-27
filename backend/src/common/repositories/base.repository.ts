import * as _ from 'lodash';
import {
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  AnyObject,
  FindOneBuilderOptions,
  FindWithPaginationBuilderOptions,
} from '@common/interfaces';
import {
  ErrorCode,
  PAGINATION_DEFAULT,
  PAGINATION_MAX_LIMIT,
} from '@common/constants';
import { NotFoundError } from 'src/errors';
import { IPaginationEntity } from '@common/interfaces';
import { convertConditionToString } from '@utils';

export class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
  public entityName = _.replace(this.constructor.name, 'Repository', '');

  public async findOneByIdOrFail(id: number): Promise<E> {
    const entity = await super.findOneById(id);

    if (!entity) {
      throw new NotFoundError(ErrorCode.NOT_FOUND, this.metadata.name);
    }
    return entity;
  }

  async findOneOrFailBase(options: FindOneOptions<E>): Promise<E> {
    const entity = await super.findOne(options);

    if (!entity) {
      throw new NotFoundError(ErrorCode.NOT_FOUND, this.metadata.name);
    }
    return entity;
  }

  async findOneByIdAndUpdate(
    id: number,
    payload: QueryDeepPartialEntity<E>,
  ): Promise<void> {
    const entity = await super.findOneById(id);

    if (!entity) {
      throw new NotFoundError(ErrorCode.NOT_FOUND, this.metadata.name);
    }

    await super.update(id, payload);
  }

  async findOneAndUpsert(
    uniqueConditions: FindOptionsWhere<E>,
    payload: QueryDeepPartialEntity<E>,
  ): Promise<void> {
    const entity = await super.findOne(uniqueConditions);

    if (entity) {
      await super.update((entity as any).id, payload);
    } else {
      await super.save({
        ...uniqueConditions,
        ...payload,
      } as E);
    }
  }

  async findAndSoftDelete(
    options: FindOptionsWhere<E>,
    deletedBy: number | string,
  ): Promise<void> {
    const payload: Partial<ObjectLiteral> = {
      deletedAt: new Date(),
      deletedBy,
    };

    await super.update(options, payload);
  }

  async findWithPagination(
    options: FindWithPaginationBuilderOptions<E>,
  ): Promise<IPaginationEntity<E>> {
    // const aliasName = _.camelCase(this.metadata.tableName);
    const aliasName: string = this.metadata.name.toLowerCase();

    const selectFields: string[] = [];
    let queryBuilder: SelectQueryBuilder<E> =
      this.createQueryBuilder(aliasName);

    let limit = Number(options.limit ?? PAGINATION_DEFAULT.LIMIT);
    let offset = Number(options.offset ?? PAGINATION_DEFAULT.OFFSET);
    const orderBy: AnyObject = options.order ?? {
      [`${aliasName}.updatedAt`]: 'DESC',
    };

    limit = Math.min(limit < 1 ? 1 : limit, PAGINATION_MAX_LIMIT);
    offset = Math.max(offset, 0);

    _.forEach(orderBy, (value, key) => {
      const [relation, fieldName] = key.split('.');
      let orderFieldName = '';
      if (!_.isNil(fieldName)) {
        orderFieldName = `${relation}.${fieldName}`;
      } else {
        orderFieldName = `${aliasName}.${relation}`;
      }
      queryBuilder.addOrderBy(orderFieldName, value);
      selectFields.push(orderFieldName);
    });

    if (!_.isEmpty(options.relations)) {
      _.forEach(_.get(options, 'relations', []), (relation: string) =>
        queryBuilder.leftJoinAndSelect(`${aliasName}.${relation}`, relation),
      );
    }

    if (!_.isEmpty(options.join)) {
      queryBuilder = this._buildJoinCondition(queryBuilder, options.join);
    }

    if (!_.isEmpty(options.where)) {
      queryBuilder = this.convertWhereToBuilder(
        queryBuilder,
        options.where ?? {},
      );
    }

    if (!_.isEmpty(options.select)) {
      const selectFieldsFromOptions: string[] = (options.select ?? []).map(
        (field: string) => {
          return _.size(field.split('.')) > 1
            ? field
            : `${this.metadata.tableName}.${field}`;
        },
      );
      selectFields.push(...selectFieldsFromOptions);
      queryBuilder = queryBuilder.select(selectFields);
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  }

  async findOneWithRelations(
    options: FindOneBuilderOptions<E>,
  ): Promise<E | null> {
    const aliasName: string = this.metadata.name.toLowerCase();
    const selectFields: string[] = [];
    let queryBuilder: SelectQueryBuilder<E> =
      this.createQueryBuilder(aliasName);

    if (!_.isEmpty(options.relations)) {
      _.forEach(options.relations, (relation: string) =>
        queryBuilder.leftJoinAndSelect(`${aliasName}.${relation}`, relation),
      );
    }

    if (!_.isEmpty(options.join)) {
      queryBuilder = this._buildJoinCondition(queryBuilder, options.join);
    }

    if (!_.isEmpty(options.where)) {
      queryBuilder = this.convertWhereToBuilder(
        queryBuilder,
        options.where ?? {},
      );
    }

    if (!_.isEmpty(options.select)) {
      const selectFieldsFromOptions: string[] = (options.select ?? []).map(
        (field: string) => {
          return _.size(field.split('.')) > 1
            ? field
            : `${this.metadata.tableName}.${field}`;
        },
      );
      selectFields.push(...selectFieldsFromOptions);
      queryBuilder = queryBuilder.select(selectFields);
    }

    return queryBuilder.getOne();
  }

  protected convertWhereToBuilder(
    queryBuilder: SelectQueryBuilder<E>,
    where: FindOptionsWhere<E>[] | FindOptionsWhere<E> | ObjectLiteral | string,
  ): SelectQueryBuilder<E> {
    // Or operator for FindConditions<E>[] condition type
    if (_.isArray(where)) {
      _.map(where, (condition) =>
        queryBuilder.orWhere(
          convertConditionToString(condition, _.camelCase(this.metadata.name)),
        ),
      );
    } else {
      queryBuilder.andWhere(
        convertConditionToString(where, _.camelCase(this.metadata.name)),
      );
    }
    return queryBuilder;
  }

  private _buildJoinCondition(
    queryBuilder: SelectQueryBuilder<E>,
    joinOptions,
  ) {
    const joinRelations = _.omit(joinOptions, ['alias']);
    _.forEach(joinRelations, (joinObject, joinMethod) => {
      _.forEach(joinObject, (relationName, relationAlias) => {
        if (_.isArray(relationName)) {
          const joinedField = relationName[0];
          const joinCondition = relationName[1];
          queryBuilder[joinMethod](joinedField, relationAlias, joinCondition);
        } else {
          queryBuilder[joinMethod](relationName, relationAlias);
        }
      });
    });

    return queryBuilder;
  }

  // Refer to github: https://github.com/typeorm/typeorm/blob/51b2a63d91d4e6a935e83f47fb958f4867e82e9c/src/repository/BaseEntity.ts#L61
  async findOneAndUpdateReturn(
    uniqueConditions: FindOptionsWhere<E>,
    payload: QueryDeepPartialEntity<E>,
  ): Promise<E> {
    const entity = await super.findOne(uniqueConditions);

    if (!entity) {
      throw new NotFoundError(ErrorCode.NOT_FOUND, this.metadata.name);
    }

    await super.update((entity as any).id, payload);

    return Object.assign(entity, payload);
  }

  public async paginate(
    limit: number = 10,
    offset: number = 0,
  ): Promise<IPaginationEntity<E>> {
    const aliasName = _.camelCase(this.metadata.name);
    const queryBuilder = this.createQueryBuilder(aliasName);

    const [data, total] = await queryBuilder
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  }
}
