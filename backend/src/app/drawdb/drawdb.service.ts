import { Injectable } from '@nestjs/common';
import { DrawDBDefinition } from '@app/drawdb/entities/drawdb.entity';
import { DrawDBDefinitionRepository } from '@app/drawdb/drawdb.repository';
import { NotFoundError } from 'src/errors';

@Injectable()
export class DrawDBService {
  constructor(
    private readonly drawDBDefinitionRepository: DrawDBDefinitionRepository,
  ) {}

  async createDrawDBDefinition(
    drawDBDefinition: DrawDBDefinition,
  ): Promise<DrawDBDefinition> {
    return this.drawDBDefinitionRepository.save(drawDBDefinition);
  }

  async getDrawDBDefinition(id: number): Promise<DrawDBDefinition> {
    return this.drawDBDefinitionRepository.findOneByIdOrFail(id);
  }

  async getLatest(): Promise<DrawDBDefinition | null> {
    return this.drawDBDefinitionRepository.findOne({
      order: {
        updatedAt: 'desc',
      },
    });
  }

  async getDrawDBDefinitions(): Promise<DrawDBDefinition[]> {
    return this.drawDBDefinitionRepository.find();
  }

  async updateDrawDBDefinition(
    drawDBDefinitionId: number,
    drawDBDefinition: DrawDBDefinition,
  ): Promise<DrawDBDefinition> {
    await this.drawDBDefinitionRepository.update(
      drawDBDefinitionId,
      drawDBDefinition,
    );
    return this.drawDBDefinitionRepository.findOneByIdOrFail(
      drawDBDefinitionId,
    );
  }

  async deleteDrawDBDefinition(drawDBDefinitionId: number): Promise<void> {
    await this.drawDBDefinitionRepository.delete(drawDBDefinitionId);
  }
}
