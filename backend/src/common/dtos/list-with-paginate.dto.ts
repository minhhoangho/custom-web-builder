import { PaginationResponseDto } from '@common/dtos/pagination.dto';
import { AnyObject } from '@common/interfaces';

export interface ListWithPaginationResponseDto {
  data: AnyObject[];

  pagination: PaginationResponseDto;
}
