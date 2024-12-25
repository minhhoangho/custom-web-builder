import { Module, Global } from '@nestjs/common';

import { RedisCacheService } from './cache.service';

@Global()
@Module({
  imports: [],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
