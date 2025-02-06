import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRepositoryModule } from '../../libs/typeorm-custom-repository';
import { DrawDBDefinition } from '@app/drawdb/entities/drawdb.entity';
import { DrawDBDefinitionRepository } from '@app/drawdb/drawdb.repository';
import { DrawDBController } from '@app/drawdb/drawdb.controller';
import { DrawDBService } from '@app/drawdb/drawdb.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DrawDBDefinition]),
    CustomRepositoryModule.forFeature([DrawDBDefinitionRepository]),
  ],
  controllers: [DrawDBController],
  providers: [DrawDBService],
  exports: [DrawDBService, TypeOrmModule],
})
export class DrawDBModule {}
