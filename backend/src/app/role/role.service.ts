import { Injectable } from '@nestjs/common';
import { Role } from '@app/role/entities/role.entity';
import { RoleRepository } from '@app/role/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getAll(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['id', 'name', 'key'],
    });
  }
}
