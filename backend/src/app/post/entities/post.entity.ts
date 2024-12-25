import { BaseEntityTimestampSoftDelete } from '@common/entity';
import { Column, JoinColumn, ManyToOne, Entity } from 'typeorm';
import { Category, User } from '@app/entity';
import { PostStatus } from '@app/post/constants';

@Entity({ name: 'posts' })
export class Post extends BaseEntityTimestampSoftDelete {
  @Column({
    type: 'varchar',
    name: 'title',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    name: 'description',
    default: '',
  })
  description: string;

  @Column({
    type: 'text',
    name: 'content',
    default: '',
  })
  content: string;

  @Column({
    type: 'varchar',
    name: 'thumbnail',
    default: '',
  })
  thumbnail: string;

  @Column({
    type: 'varchar',
    name: 'cover',
    default: '',
  })
  cover: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    default: PostStatus.Unpublished,
  })
  status: number;

  @Column({
    type: 'tinyint',
    name: 'category_id',
    default: null,
  })
  categoryId: number;

  @Column({
    type: 'tinyint',
    name: 'author_id',
    nullable: true,
    default: null,
  })
  authorId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: 'author_id',
  })
  author: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;
}
