import { BeforeInsert, Column } from 'typeorm';
import { Constructor } from '@common/entity/types';
import { CurrentUserContext } from '@common/context';

export function UserInteractionEntity<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @Column({ name: 'created_by', nullable: true })
    public createdBy: string;

    @Column({ name: 'updated_by', nullable: true })
    public updatedBy: string;

    @BeforeInsert()
    updateTimestamp() {
      if (!this.createdBy) {
        const currentUser = CurrentUserContext.get();
        if (currentUser) {
          this.createdBy = currentUser.id;
        }
      }
    }
  }

  return AbstractBase;
}
