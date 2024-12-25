import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function LogoutApiDoc() {
  return applyDecorators(ApiOperation({summary: 'Logout' }), ApiOkResponse());
}
