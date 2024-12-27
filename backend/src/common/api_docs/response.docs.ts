import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AnyObject } from '@common/interfaces';

export const NoContentResponseApiDoc = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
  );

export const CreatedResponseApiDoc = (exampleData: AnyObject = {}) =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      schema: {
        example: exampleData,
      },
    }),
  );

export const ObjectResponseApiDoc = (exampleData: AnyObject = {}) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        example: exampleData,
      },
    }),
  );
