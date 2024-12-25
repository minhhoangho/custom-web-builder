import { Injectable, Scope } from '@nestjs/common';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { Connection, EntityManager } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable({ scope: Scope.REQUEST })
export class DatabaseUnitOfWork {
  private transactionManager: EntityManager | null;

  private isolationLevel: IsolationLevel | undefined;

  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {
    this.transactionManager = null;
  }

  getTransactionManager(): EntityManager | null {
    return this.transactionManager;
  }

  getConnection(): Connection {
    return this.connection;
  }

  setIsolationLevel(isolationLevel: IsolationLevel): DatabaseUnitOfWork {
    this.isolationLevel = isolationLevel;
    return this;
  }

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction(this.isolationLevel);
    this.transactionManager = queryRunner.manager;
    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.transactionManager = null;
      this.isolationLevel = undefined;
    }
  }
}
