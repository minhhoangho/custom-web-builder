import { ApiProperty } from '@nestjs/swagger';

export class BasicCategoryInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class CategoryDetail {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  updatedAt: Date;
}
