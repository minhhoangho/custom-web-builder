import {
  BaseEntity as BaseEntityTyperOrm,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInteractionEntity } from '@common/entity/user-interaction.entity';
import { TimeStampEntity } from '@common/entity/timestamp.entity';
import { SoftDeleteEntity } from '@common/entity/soft-delete.entity';

export class BaseEntityTimestamp extends TimeStampEntity(
  UserInteractionEntity(BaseEntityTyperOrm),
) {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export class BaseEntityTimestampSoftDelete extends TimeStampEntity(
  UserInteractionEntity(SoftDeleteEntity(BaseEntityTyperOrm)),
) {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
