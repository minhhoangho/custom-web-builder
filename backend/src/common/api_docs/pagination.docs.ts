import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AnyObject } from '@common/interfaces';

export const PaginationResponseApiDoc = (exampleData: AnyObject[] = []) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        example: {
          data: exampleData,
          pagination: {
            total: 0,
            limit: 10,
            offset: 0,
          },
        },
      },
    }),
  );

export const PaginationParamApiDoc = () =>
  applyDecorators(
    ApiQuery({
      name: 'limit',
      schema: {
        type: 'integer',
        default: 10,
        description: 'limit',
        maximum: 100,
        minimum: 1,
      },
    }),
    ApiQuery({
      name: 'offset',
      schema: {
        type: 'integer',
        default: 0,
        description: 'offset',
        minimum: 0,
      },
    }),
  );
