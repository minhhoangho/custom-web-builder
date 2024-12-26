import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

export function LoginApiDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Login' }),
    ApiBody({
      schema: {
        example: {
          email: 'user@test.vn',
          password: '12345678',
        },
        required: ['email', 'password'],
        properties: {
          email: {
            description: 'User email',
            type: 'string',
            format: 'email',
          },
          password: {
            description: 'User password',
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({}),
  );
}
