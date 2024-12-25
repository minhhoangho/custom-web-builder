import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Category, Post, User } from '@app/entity';
import { PaginationResponseDto } from '@common/dtos/pagination.dto';
import { AuthorInfo } from '@app/user/dto/responses/author.dto';
import { BasicCategoryInfo } from '@app/category/dto/responses/category.dto';

class PostItem extends PartialType(OmitType(Post, ['categoryId', 'authorId'])) {
  @ApiProperty({ type: AuthorInfo })
  author: User;

  @ApiProperty({ type: BasicCategoryInfo })
  category: Category;
}

export class ListPostPaginateDto {
  @ApiProperty({ type: PostItem, isArray: true })
  data: Partial<Post>[];

  @ApiProperty()
  pagination: PaginationResponseDto;
}
