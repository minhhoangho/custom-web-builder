import { Inject, Injectable, Scope } from '@nestjs/common';
import { ObjectLiteral, ObjectType } from 'typeorm';
import { DatabaseUnitOfWork } from '@common/uow/unit-of-work';
import { BaseRepository } from '@common/repositories/base.repository';

@Injectable({ scope: Scope.REQUEST })
export class TransactionalRepository {
  constructor(
    @Inject(DatabaseUnitOfWork)
    private uow: DatabaseUnitOfWork,
  ) {}

  /**
   * Gets a repository bound to the current transaction manager
   * or defaults to the current connection's call to getRepository().
   */
  getRepository<E extends ObjectLiteral, R extends BaseRepository<E>>(
    repository: ObjectType<R>,
  ): R {
    const transactionManager = this.uow.getTransactionManager();
    if (transactionManager) {
      return transactionManager.getRepository<E>(repository) as R;
    }
    // const baseRepository = this.uow.getConnection().getRepository(repository);
    // return new repository(
    //   baseRepository.target,
    //   baseRepository.manager,
    //   baseRepository.queryRunner,
    // );
    return this.uow.getConnection().getRepository<E>(repository) as R;
  }
}
