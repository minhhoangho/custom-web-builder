import { get } from 'lodash';
import { config } from 'dotenv';

config();

export const appConfig = {
  rest: {
    port: Number(get(process.env, 'REST_PORT', 3000)),
    host: get(process.env, 'REST_HOST', 'localhost'),
  },
  redis: {
    host: get(process.env, 'REDIS_HOST', 'redis'),
    port: Number(get(process.env, 'REDIS_PORT', 6379)),
    password: get(process.env, 'REDIS_PASSWORD', ''),
    prefix: get(process.env, 'REDIS_PREFIX', 'app'),
  },
  queue: {
    prefix: get(process.env, 'QUEUE_NAME', 'queue_prefix'),
  },
  db: {
    type: get(process.env, 'DB_TYPE', 'postgres'),
    host: get(process.env, 'DB_HOST', 'postgres'),
    port: Number(get(process.env, 'DB_PORT', 5432)),
    username: get(process.env, 'DB_USERNAME', 'postgres'),
    password: get(process.env, 'DB_PASSWORD', 'password'),
    database: get(process.env, 'DB_DATABASE_NAME', 'base-api'),
    logging: false,
  },
  aws: {
    region: get(process.env, 'AWS_REGION', 'ap-southest-1'),
    accessKeyId: get(process.env, 'AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: get(process.env, 'AWS_SECRET_ACCESS_KEY', ''),
    bucketName: get(process.env, 'AWS_BUCKET_NAME', 'base'),
    signUrlTimeout: Number(get(process.env, 'AWS_SIGN_URL_TIMEOUT')|| 60),
  },
  locale: {
    supportedLocales: get(process.env, 'LOCALE_SUPPORTED_LOCALES')?.split(
      ',',
    ) ?? ['en', 'vi'],
    default: get(process.env, 'LOCALE_DEFAULT', 'vi'),
  },
  debug: get(process.env, 'DEBUG', 'true') === 'true',
  logLevel: get(process.env, 'LOG_LEVEL', 'info'),
  logPath: get(process.env, 'LOG_PATH', 'logs'),
  cacheFilePath: get(process.env, 'CACHE_FILE_PATH', 'cache/files'),
  sentry: {
    enable: get(process.env, 'SENTRY_ENABLE', 'false') === 'true',
    dsn: get(process.env, 'SENTRY_DSN', ''),
  },
  jwt: {
    jwtSecret: get(process.env, 'JWT_SECRET', 'jwtSecret'),
  },
  auth: {
    accessTokenTTL: Number(
      get(process.env, 'JWT_EXPIRES_ACCESS_TOKEN') ||  3600 * 24 * 7,
    ),
    refreshTokenTTL: Number(
      get(process.env, 'JWT_EXPIRES_REFRESH_TOKEN') || 3600 * 24 * 7 * 2,
    ),
  },
  mail: {
    user: get(process.env, 'MAIL_USER', 'email.dev@gmail.com'),
    pass: get(process.env, 'MAIL_PASSWORD', 'email@123'),
  },
  app: {
    name: get(process.env, 'APP_NAME', 'Base app'),
  },
  google: {
    clientId: get(process.env, 'GOOGLE_CLIENT_ID'),
    clientSecret: get(process.env, 'GOOGLE_CLIENT_SECRET'),
  },
  kafka: {},
};
