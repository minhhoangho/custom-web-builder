import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from '@app/post/post.repository';
import { UserRepository } from '@app/user/user.repository';
import { CustomRepositoryModule } from '../../libs/typeorm-custom-repository';
import { Post, User } from '@app/entity';
import { CategoryModule } from '@app/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    CustomRepositoryModule.forFeature([PostRepository, UserRepository]),
    CategoryModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
