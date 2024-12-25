import { applyDecorators, UsePipes } from '@nestjs/common';

export const Validation = (...validationClasses: any[]) =>
  applyDecorators(UsePipes(...validationClasses));
