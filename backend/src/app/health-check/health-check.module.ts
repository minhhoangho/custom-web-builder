import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';

@Module({
  imports: [],
  controllers: [HealthCheckController],
  providers: [],
  exports: [],
})
export class HealthCheckModule {}
