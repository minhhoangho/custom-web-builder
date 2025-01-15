import { User } from '@app/entity';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginPayloadDto, LoginResponseDto } from '@app/auth/dto';
import { TokenPayloadInterface } from "@app/auth/interfaces";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

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
    ) as User;
    const userAgent = req.get('user-agent') ?? 'UNKNOWN';
    const ip = req.ip ?? 'UNKNOWN';
    const data: TokenPayloadInterface = await this.authService.createAuthToken(
      user,
      {
        userAgent,
        ip,
      },
    );
    console.log("User", user);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expirationTime: data.expirationTime,
      user,
    } as LoginResponseDto;
  }
}
