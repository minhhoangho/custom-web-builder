import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeORMLogger } from '@database/db-logger';
import loadConfig from 'src/configs';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: <never>loadConfig.db.type,
  host: loadConfig.db.host,
  port: loadConfig.db.port,
  username: loadConfig.db.username,
  password: loadConfig.db.password,
  database: loadConfig.db.database,
  entities: [join(__dirname, '../', 'app/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../', 'database/migrations/*{.ts,.js}')],
  // synchronize: true,
  migrationsRun: false,
  logger: new TypeORMLogger(),
  logging: loadConfig.db.logging,
  connectionTimeout: 20000,
  options: {
    useUTC: true,
  },
  pool: {
    max: 10,
  },
  /* Optional for development */
  // ssl: {
  //   rejectUnauthorized: false
  // }
};

export const MysqlDataSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);
