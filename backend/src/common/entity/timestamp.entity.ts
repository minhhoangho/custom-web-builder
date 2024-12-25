import { Constructor } from '@common/entity/types';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export function TimeStampEntity<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    public updatedAt: Date;
  }
  return AbstractBase;
}
