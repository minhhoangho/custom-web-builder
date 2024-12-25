import { PaginationResponseDto } from '@common/dtos/pagination.dto';

export interface ListWithPaginationResponseDto {
  data: any[];

  pagination: PaginationResponseDto;
}
