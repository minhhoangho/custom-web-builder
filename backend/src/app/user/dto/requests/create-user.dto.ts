import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @MinLength(1)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  avatar?: string;
}
