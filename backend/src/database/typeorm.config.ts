import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import envConfig from 'src/configs';
import {join} from 'path';
import {DataSource, DataSourceOptions} from 'typeorm';
import {TypeORMLogger} from '@database/db-logger';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: <never>envConfig.db.type,
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.username,
  password: envConfig.db.password,
  database: envConfig.db.database,
  entities: [join(__dirname, '../', 'app/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../', 'database/migrations/*{.ts,.js}')],
  // synchronize: true,
  migrationsRun: false,
  logger: new TypeORMLogger(),
  logging: envConfig.db.logging,
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
