import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityTimestampSoftDelete } from '@common/entity';
import { Post } from '@app/entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntityTimestampSoftDelete {
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    name: 'description',
    default: '',
  })
  description: string;

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Post[];
}
