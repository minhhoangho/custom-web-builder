import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '@app/post/dto/requests';
import { Post } from '@app/post/entities/post.entity';
import { PostRepository } from '@app/post/post.repository';
import { FindWithPaginationBuilderOptions } from '@common/interfaces';
import { PaginationParamDto } from '@common/dtos/pagination-param.dto';
import { IPaginationEntity } from '@common/interfaces';
import { NotFoundError } from '../../errors';
import { UpdateResult } from 'typeorm';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost: Post = await this.postRepository
      .create(createPostDto)
      .save({ reload: true });
    return this.detail(createdPost.id);
  }

  listPaginate(
    query: PaginationParamDto,
  ): Promise<IPaginationEntity<Partial<Post>>> {
    const options: FindWithPaginationBuilderOptions<Post> = {
      relations: ['author', 'category'],
      limit: query.limit,
      offset: query.offset,
    };

    return this.postRepository.findWithPagination(options);
  }

  async detail(id: number): Promise<Post> {
    const postDetail = await this.postRepository.findOneWithRelations({
      where: {
        id,
      },
      relations: ['author', 'category'],
    });

    if (!postDetail) throw new NotFoundError();

    return postDetail;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.findOneByIdAndUpdate(id, updatePostDto);
    return this.detail(id);
  }

  remove(id: number): Promise<UpdateResult> {
    return this.postRepository.softDelete(id);
  }
}
