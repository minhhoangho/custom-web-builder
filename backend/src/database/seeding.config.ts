import loadConfig from 'src/configs';
import { join } from 'path';

const seedingConfig = {
  type: <any>loadConfig.db.type,
  host: loadConfig.db.host,
  port: loadConfig.db.port,
  username: loadConfig.db.username,
  password: loadConfig.db.password,
  database: loadConfig.db.database,
  entities: [join(__dirname, '../', '**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../', 'database/migrations/**/*.ts')],
  seeds: ['src/database/seeds/*.seed{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}']
  /* Optional for development */
  // ssl: {
  //   rejectUnauthorized: false
  // }
};
export = seedingConfig;
