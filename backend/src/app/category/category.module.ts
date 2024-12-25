import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRepositoryModule } from '../../libs/typeorm-custom-repository';
import { Category } from '@app/entity';
import { CategoryRepository } from '@app/category/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CustomRepositoryModule.forFeature([CategoryRepository]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
