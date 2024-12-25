import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

export const NoContentResponseApiDoc = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content'
    }),
  );

export const CreatedResponseApiDoc = (exampleData: any = {}) =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      schema: {
        example: exampleData
      }
    }),
  );

export const ObjectResponseApiDoc = (exampleData: any = {}) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        example: exampleData
      }
    }),
  );
