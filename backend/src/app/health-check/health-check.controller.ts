import { Controller, Get } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health check')
@Controller('/')
export class HealthCheckController {
  @Get('/status')
  apiStatus() {
    const packageJsonFilePath = path.join(__dirname, '../../../package.json');
    const app = JSON.parse(fs.readFileSync(packageJsonFilePath, 'utf8'));

    return {
      status: 'OK',
      name: app.name,
      version: app.version,
    };
  }
}
