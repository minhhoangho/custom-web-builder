import { FindOptionsWhere, ObjectLiteral } from 'typeorm';

export interface AnyObject {
  [property: string]: any;
}

export interface FilterMethods<T> {
  getWhereCondition(
    conditionFields: AnyObject,
  ): Promise<
    FindOptionsWhere<T>[] | FindOptionsWhere<T> | ObjectLiteral | string
  >;
  getCustomFields(): string[];
}

export interface FindWithPaginationBuilderOptions<T> {
  where?: FindOptionsWhere<T>[] | FindOptionsWhere<T> | ObjectLiteral | string;
  select?: string[];
  relations?: string[];
  join?: {
    leftJoinAndSelect?: {
      [key: string]: string | [string, string];
    };
    innerJoinAndSelect?: {
      [key: string]: string;
    };
    leftJoin?: {
      [key: string]: string;
    };
    innerJoin?: {
      [key: string]: string;
    };
  };
  order?: AnyObject;
  limit?: number;
  offset?: number;
}

export interface FindOneBuilderOptions<T> {
  where?: FindOptionsWhere<T>[] | FindOptionsWhere<T> | ObjectLiteral | string;
  select?: string[];
  relations?: string[];
  join?: {
    leftJoinAndSelect?: {
      [key: string]: string | [string, string];
    };
    innerJoinAndSelect?: {
      [key: string]: string;
    };
    leftJoin?: {
      [key: string]: string;
    };
    innerJoin?: {
      [key: string]: string;
    };
  };
}
