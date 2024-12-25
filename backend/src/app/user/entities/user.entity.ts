import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityTimestampSoftDelete } from '@common/entity';
import { Post, Role } from '@app/entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BaseEntityTimestampSoftDelete {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    name: 'email',
    nullable: false,
  })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  lastName: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  avatar: string;

  @Column({
    name: 'google_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  googleId: string;

  @Column({
    name: 'credentials',
    type: 'json',
    nullable: true,
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  credentials: Object;

  @Column({
    name: 'role_id',
    type: 'integer',
  })
  roleId: number;

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;
}
