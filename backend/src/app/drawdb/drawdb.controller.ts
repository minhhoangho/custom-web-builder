import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DrawDBDefinition } from '@app/drawdb/entities/drawdb.entity';
import { ApiTags } from '@nestjs/swagger';
import { DrawDBService } from '@app/drawdb/drawdb.service';

@ApiTags('DrawDB')
@Controller('drawdb/databases')
export class DrawDBController {
  constructor(private readonly drawDBService: DrawDBService) {}

  @Get()
  async getAll(): Promise<DrawDBDefinition[]> {
    return this.drawDBService.getDrawDBDefinitions();
  }
  @Get('/latest')
  async getLatest(): Promise<DrawDBDefinition | null> {
    return this.drawDBService.getLatest();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<DrawDBDefinition> {
    return this.drawDBService.getDrawDBDefinition(id);
  }

  @Post()
  async create(
    @Body() drawDBDefinition: DrawDBDefinition,
  ): Promise<DrawDBDefinition> {
    return this.drawDBService.createDrawDBDefinition(drawDBDefinition);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() drawDBDefinition: DrawDBDefinition,
  ): Promise<DrawDBDefinition> {
    return this.drawDBService.updateDrawDBDefinition(id, drawDBDefinition);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.drawDBService.deleteDrawDBDefinition(id);
  }
}
