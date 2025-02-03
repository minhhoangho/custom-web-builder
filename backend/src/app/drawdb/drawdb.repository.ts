import { BaseRepository } from '@common/repositories';
import { EntityRepository } from 'src/libs/typeorm-custom-repository';
import { DrawDBDefinition } from "@app/drawdb/entities/drawdb.entity";

@EntityRepository(DrawDBDefinition)
export class DrawDBDefinitionRepository extends BaseRepository<DrawDBDefinition> {}
