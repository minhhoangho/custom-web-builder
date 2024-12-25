import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Category, Post, User } from '@app/entity';

import { AuthorInfo } from '@app/user/dto/responses/author.dto';
import { BasicCategoryInfo } from '@app/category/dto/responses/category.dto';

export class PostDetailDto extends PartialType(Post) {
  @ApiProperty({ type: AuthorInfo })
  author: User;

  @ApiProperty({ type: BasicCategoryInfo })
  category: Category;
}
