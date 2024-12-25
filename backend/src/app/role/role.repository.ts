import { BaseRepository } from '@common/repositories';
import { Role } from './entities/role.entity';
import { EntityRepository } from '../../libs/typeorm-custom-repository';

@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {}
