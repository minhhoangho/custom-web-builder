import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { JSONObject } from '@common/types';

export const NoContentResponseApiDoc = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
  );

export const CreatedResponseApiDoc = (exampleData: JSONObject = {}) =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      schema: {
        example: exampleData,
      },
    }),
  );

export const ObjectResponseApiDoc = (exampleData: JSONObject = {}) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        example: exampleData,
      },
    }),
  );
