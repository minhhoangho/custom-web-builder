import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { Auth } from '@common/decorators';
import { Role } from '@app/entity';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(public roleService: RoleService) {}

  @Auth()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  list(): Promise<Partial<Role>[]> {
    return this.roleService.getAll();
  }
}
