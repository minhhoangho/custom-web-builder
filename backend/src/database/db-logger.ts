import { Logger, QueryRunner } from 'typeorm';
import * as winston from 'winston';
import { join } from 'path';

// Create a logger instance using Winston
const typeormLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: join(__dirname, '../../logs/typeorm.log'),
    }),
  ],
});

export class TypeORMLogger implements Logger {
  // implement all methods from logger class
  logQuery(query: string, parameters?: never[], _queryRunner?: QueryRunner) {
    typeormLogger.info(`[QUERY]: ${query}`);
    if (parameters) {
      typeormLogger.info(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: never[],
    _queryRunner?: QueryRunner,
  ) {
    typeormLogger.error(`[ERROR]: ${error}`);
    typeormLogger.error(`[QUERY]: ${query}`);
    if (parameters) {
      typeormLogger.error(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: never[],
    _queryRunner?: QueryRunner,
  ) {
    typeormLogger.warn(`[SLOW QUERY (${time} ms)]: ${query}`);
    if (parameters) {
      typeormLogger.warn(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    typeormLogger.info(`[SCHEMA BUILD]: ${message}`);
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    typeormLogger.info(`[MIGRATION]: ${message}`);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: string,
    _queryRunner?: QueryRunner,
  ) {
    switch (level) {
      case 'log':
        typeormLogger.info(message);
        break;
      case 'info':
        typeormLogger.info(message);
        break;
      case 'warn':
        typeormLogger.warn(message);
        break;
    }
  }
}
