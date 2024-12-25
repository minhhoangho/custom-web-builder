import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from '@app/post/dto/requests';
import { ApiTags } from '@nestjs/swagger';
import { PaginationParamDto } from '@common/dtos/pagination-param.dto';
import { ListPostPaginateDto } from '@app/post/dto/responses/list-post.dto';
import { PostDetailDto } from '@app/post/dto/responses/post-detail.dto';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  create(@Body() createPostDto: CreatePostDto): Promise<PostDetailDto> {
    return this.postService.create(createPostDto);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  listPaginate(
    @Query() queryParams: PaginationParamDto,
  ): Promise<ListPostPaginateDto> {
    return this.postService.listPaginate(queryParams);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  retrieve(@Param('id', ParseIntPipe) id: number): Promise<PostDetailDto> {
    return this.postService.detail(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDetailDto> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
