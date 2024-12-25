import { Roles } from '@common/constants/common';
import { RolesGuard, JwtAuthGuard } from '@common/guards';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const Auth = (...roles: Roles[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    // AuthenticatedGuard is used for assigning user to request, RolesGuard is used for checking roles
    UseGuards(JwtAuthGuard, RolesGuard),
  );
