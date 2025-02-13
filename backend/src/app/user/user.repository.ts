import { BaseRepository } from '@common/repositories';
import { User } from '@app/entity';
import { EntityRepository } from 'src/libs/typeorm-custom-repository';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
