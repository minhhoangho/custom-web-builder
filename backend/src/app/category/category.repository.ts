import { BaseRepository } from '@common/repositories';
import { Category } from '@app/entity';
import { EntityRepository } from '../../libs/typeorm-custom-repository';

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {}
