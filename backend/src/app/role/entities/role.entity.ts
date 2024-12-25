import { BaseEntityTimestamp } from '@common/entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends BaseEntityTimestamp {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'key',
    type: 'varchar',
    length: 255,
  })
  key: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;
}
