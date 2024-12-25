import { Constructor } from '@common/entity/types';
import { Column, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export function SoftDeleteEntity<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiHideProperty()
    @Exclude()
    @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'deleted_by', nullable: true })
    public deletedBy: string;
  }
  return AbstractBase;
}
