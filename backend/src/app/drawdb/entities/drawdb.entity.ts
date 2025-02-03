import { Column, Entity } from 'typeorm';
import { BaseEntityTimestampSoftDelete } from '@common/entity';
import { AnyObject } from '@common/interfaces';

@Entity({ name: 'draw_db_definitions' })
export class DrawDBDefinition extends BaseEntityTimestampSoftDelete {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'database',
    nullable: false,
  })
  database: string;


  @Column({
    type: 'json',
    name: 'pan',
    nullable: true,
  })
  pan: AnyObject;
  @Column({
    type: 'json',
    name: 'note',
    nullable: true,
  })
  note: AnyObject[];

  @Column({
    type: 'json',
    name: 'references',
    nullable: true,
  })
  references: AnyObject[];

  @Column({
    type: 'json',
    name: 'areas',
    nullable: true,
  })
  areas: AnyObject[];

  @Column({
    type: 'json',
    name: 'tables',
    nullable: true,
  })
  tables: AnyObject[];

  @Column({
    type: 'json',
    name: 'todo',
    nullable: true,
  })
  todo: AnyObject[];

  @Column({
    type: 'float',
    name: 'zoom',
    nullable: false,
    default: 1.0,
  })
  zoom: number;
}
