import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  offset: number = 0;
}
