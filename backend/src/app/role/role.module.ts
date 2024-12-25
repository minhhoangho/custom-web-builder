import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CustomRepositoryModule } from '../../libs/typeorm-custom-repository';
import { RoleRepository } from '@app/role/role.repository';

@Module({
  imports: [CustomRepositoryModule.forFeature([RoleRepository])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
