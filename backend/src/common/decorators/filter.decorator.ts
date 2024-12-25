import { applyDecorators, UseInterceptors } from '@nestjs/common';

export const Filter = (...filterClasses: any[]) =>
  applyDecorators(UseInterceptors(...filterClasses));
