import { Injectable, Logger } from '@nestjs/common';
import { DrawDBDefinition } from '@app/drawdb/entities/drawdb.entity';
import { DrawDBDefinitionRepository } from '@app/drawdb/drawdb.repository';
import { IsNull } from 'typeorm';

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
    const data = await this.drawDBDefinitionRepository.findOneByIdOrFail(id);
    console.log('DrawDBService -> getDrawDBDefinition -> data', data);
    return data;
  }

  async getLatest(): Promise<DrawDBDefinition | null> {
    return this.drawDBDefinitionRepository.findOne({
      where: {
        deletedAt: IsNull(),
      },
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
