import { User } from '@app/entity';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginPayloadDto, LoginResponseDto } from '@app/auth/dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Req() req: Request,
    @Body() body: LoginPayloadDto,
  ): Promise<LoginResponseDto> {
    const { email, password } = body;
    const user: User = await this.authService.validateUserByEmailPassword(
      email,
      password,
    );
    const userAgent = req.get('user-agent') ?? 'UNKNOWN';
    const ip = req.ip ?? 'UNKNOWN';
    const data: LoginResponseDto = await this.authService.createAuthToken(
      user,
      {
        userAgent,
        ip,
      },
    );

    return data;
  }
}
