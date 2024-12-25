import { PaginationResponseDto } from '@common/dtos/pagination.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { User } from '@app/entity';

class UserItem extends PartialType(OmitType(User, ['posts'])) {}
export class ListUserPaginateDto {
  @ApiProperty({ type: UserItem, isArray: true })
  data: Partial<User>[];

  @ApiProperty()
  pagination: PaginationResponseDto;
}
