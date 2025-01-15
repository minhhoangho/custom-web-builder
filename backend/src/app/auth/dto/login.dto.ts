import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPayloadDto {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty()
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYjY5YWUyLTRiN2YtNDg3MC05MmIyLWM5YjlhMjVhMTY4ZSIsInVzZXIiOnsi',
  })
  accessToken: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @MinLength(5)
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYjY5YWUyLTRiN2YtNDg3MC05MmIyLWM5YjlhMjVhMTY4ZSIsInVzZXIiOnsi',
  })
  refreshToken: string;

  @ApiProperty({ example: 86400 })
  expirationTime: number;

  @ApiProperty({ example: {
    id: 1,
    email: 'admin@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
  }})
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}
// export function LoginPayloadApiDoc() {
//   return applyDecorators(
//     ApiOperation({ summary: 'Login' }),
//     ApiBody({
//       schema: {
//         example: {
//           email: 'user@test.vn',
//           password: '12345678',
//         },
//         required: ['email', 'password'],
//         properties: {
//           email: {
//             description: 'User email',
//             type: 'string',
//             format: 'email',
//           },
//           password: {
//             description: 'User password',
//             type: 'string',
//           },
//         },
//       },
//     }),
//     // ApiProperty({
//     //   status: HttpStatus.OK,
//     //   schema: {
//     //     accessToken: 'Sample access token',
//     //   },
//     // }),
//   );
// }
