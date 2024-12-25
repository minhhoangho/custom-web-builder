import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Sample title' })
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Sample description' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '<p>Sample post content</p>' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example:
      'https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ',
  })
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({
    example:
      'https://fastly.picsum.photos/id/903/800/300.jpg?hmac=ypDxy84hpqdOKo2NrQAZ5F_F7XYTH_Od25sC9CA1_zY',
  })
  @IsNotEmpty()
  cover: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
