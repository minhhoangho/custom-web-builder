import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '@app/category/dto/requests/create-category.dto';
import { UpdateCategoryDto } from '@app/category/dto/requests/update-category.dto';
import { CategoryRepository } from '@app/category/category.repository';
import { Category } from '@app/entity';
import { UpdateResult } from 'typeorm';
import { BasicCategoryInfo } from '@app/category/dto/responses/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository
      .create(createCategoryDto)
      .save({ reload: true });
  }

  findAll(): Promise<BasicCategoryInfo[]> {
    return this.categoryRepository.find({
      select: ['id', 'name'],
    });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneByIdOrFail(id);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryRepository.findOneByIdAndUpdate(id, updateCategoryDto);
    return this.findOne(id);
  }

  remove(id: number): Promise<UpdateResult> {
    return this.categoryRepository.softDelete(id);
  }
}
