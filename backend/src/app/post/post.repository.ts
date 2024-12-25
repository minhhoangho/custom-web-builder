import { BaseRepository } from '@common/repositories';
import { Post } from '@app/entity';
import { EntityRepository } from '../../libs/typeorm-custom-repository';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}
