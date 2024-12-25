import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { compareSync } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import loadConfig from 'src/configs';

import { User } from '@app/entity';
import { UserRepository } from '@app/user/user.repository';
import { RedisCacheService } from 'src/providers/cache/cache.service';
import { generateJwtToken, verifyToken } from 'src/utils/jwt.helper';
import { UnAuthorizedError } from 'src/errors/unauthorized.error';
import { ErrorCode } from '@common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginResponseDto } from '@app/auth/dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private cacheService: RedisCacheService,
  ) {}

  private getUserAuthRedisKey(userId) {
    return `${loadConfig.redis.prefix}-auth:${userId}`;
  }

  private getAccessTokenRedisKey(userId: number, cacheKey: string) {
    const redisKey = this.getUserAuthRedisKey(userId);
    return `${redisKey}:access-token-${cacheKey}`;
  }

  private getRefreshTokenRedisKey = (userId: number, cacheKey: string) => {
    const redisKey = this.getUserAuthRedisKey(userId);
    return `${redisKey}:refresh-token-${cacheKey}`;
  };

  public async verifyAccessToken(token: string, jwtPayload): Promise<User> {
    const user: User = _.get(jwtPayload, 'user');
    const cacheKey = _.get(jwtPayload, 'id');

    if (!user) {
      throw new UnAuthorizedError();
    }

    const accessTokenRedisKey = this.getAccessTokenRedisKey(user.id, cacheKey);
    const isRegisteredJWT = await this.cacheService.exists(accessTokenRedisKey);

    if (!isRegisteredJWT) {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'Access token invalid',
      });
    }

    return user;
  }

  public async createAuthToken(
    user: User,
    context: { userAgent: string; ip: string },
  ): Promise<LoginResponseDto> {
    const { userAgent, ip } = context;
    return this.createToken(user, { userAgent, ip });
  }

  private async issueTokens(user, context = null) {
    const accessTokenId = uuidv4();
    const refreshTokenId = uuidv4();

    const accessToken = generateJwtToken(
      {
        id: accessTokenId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        context,
        type: 'accessToken',
      },
      loadConfig.auth.accessTokenTTL,
    );
    const refreshToken = generateJwtToken(
      {
        id: refreshTokenId,
        accessTokenId,
        user: {
          id: user.id,
        },
        type: 'refreshToken',
      },
      loadConfig.auth.refreshTokenTTL,
    );

    const accessTokenRedisKey = this.getAccessTokenRedisKey(
      user.id,
      accessTokenId,
    );
    const refreshTokenRedisKey = this.getRefreshTokenRedisKey(
      user.id,
      refreshTokenId,
    );

    await Promise.all([
      this.cacheService.set(accessTokenRedisKey, accessToken),
      this.cacheService.set(refreshTokenRedisKey, refreshToken),
    ]);

    await Promise.all([
      this.cacheService.expires(
        refreshTokenRedisKey,
        loadConfig.auth.refreshTokenTTL + 5,
      ),
      this.cacheService.expires(
        accessTokenRedisKey,
        loadConfig.auth.accessTokenTTL + 5,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createToken(
    user: User,
    { userAgent, ip }: { userAgent: string; ip: string },
  ) {
    const { accessToken, refreshToken } = await this.issueTokens(user, {
      userAgent,
      ip,
    });
    return {
      accessToken,
      refreshToken,
      expirationTime: loadConfig.auth.accessTokenTTL,
    };
  }

  async refreshToken(user: User, refreshToken: string) {
    const payload = await verifyToken(refreshToken);
    const refreshTokenId = _.get(payload, 'id');
    const accessTokenId = _.get(payload, 'accessTokenId');

    const refreshTokenRedisKey = this.getRefreshTokenRedisKey(
      user.id,
      refreshTokenId,
    );

    const isRegisteredJWT =
      await this.cacheService.exists(refreshTokenRedisKey);

    if (!isRegisteredJWT) {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'Refresh token expired',
      });
    }

    const oldAccessTokenRedisKey = this.getAccessTokenRedisKey(
      user.id,
      accessTokenId,
    );

    if (oldAccessTokenRedisKey) {
      await this.cacheService.del(oldAccessTokenRedisKey);
    }

    const newAccessToken = generateJwtToken(
      {
        id: accessTokenId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        type: 'accessToken',
      },
      loadConfig.auth.accessTokenTTL + 5,
    );

    const accessTokenRedisKey = this.getAccessTokenRedisKey(
      user.id,
      accessTokenId,
    );

    await Promise.all([
      this.cacheService.set(accessTokenRedisKey, newAccessToken),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken,
      expirationTime: loadConfig.auth.accessTokenTTL,
    };
  }

  public async validateUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName'],
    });

    if (_.isEmpty(user)) {
      throw new UnAuthorizedError();
    }

    // Hash password on parameter before compare to db
    // Using bcryptjs to hash id payload -> return token with result
    if (user && compareSync(password, user.password)) {
      return user;
    }

    throw new UnAuthorizedError();
  }
}
