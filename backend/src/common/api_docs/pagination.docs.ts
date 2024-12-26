import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

export const PaginationResponseApiDoc = (exampleDatas: any[] = []) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        example: {
          data: exampleDatas,
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
