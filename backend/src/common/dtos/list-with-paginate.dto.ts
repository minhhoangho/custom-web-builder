import { PaginationResponseDto } from '@common/dtos/pagination.dto';
import { JSONObject } from '@common/types';

export interface ListWithPaginationResponseDto {
  data: JSONObject[];

  pagination: PaginationResponseDto;
}
