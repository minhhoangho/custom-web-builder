import { Module, Global } from '@nestjs/common';
import { TransactionalRepository } from '@common/uow/transactional.repository';
import { DatabaseUnitOfWork } from '@common/uow/unit-of-work';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@database/typeorm.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  providers: [DatabaseUnitOfWork, TransactionalRepository],
  exports: [DatabaseUnitOfWork, TransactionalRepository],
})
export class UOWModule {}
