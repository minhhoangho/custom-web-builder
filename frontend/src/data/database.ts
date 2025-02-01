import { DB } from '@constants/editor';
import i18n from 'src/i18n/i18n';
import { DBAttributeType, DBValueType } from './interface';

export const databaseDefinitions = {
  [DB.MYSQL]: {
    name: 'MySQL',
    label: DB.MYSQL,
    image: '/static/images/database/mysql-icon.png',
    hasTypes: false,
    hasUnsignedTypes: true,
  },
  [DB.POSTGRES]: {
    name: 'PostgreSQL',
    label: DB.POSTGRES,
    image: '/static/images/database/postgres-icon.png',
    hasTypes: true,
    hasEnums: true,
    hasArrays: true,
  },
  [DB.SQLITE]: {
    name: 'SQLite',
    label: DB.SQLITE,
    image: '/static/images/database/sqlite-icon.png',
    hasTypes: false,
  },
  [DB.MARIADB]: {
    name: 'MariaDB',
    label: DB.MARIADB,
    image: '/static/images/database/mariadb-icon.png',
    hasTypes: false,
    hasUnsignedTypes: true,
  },
  [DB.MSSQL]: {
    name: 'MSSQL',
    label: DB.MSSQL,
    image: '/static/images/database/mssql-icon.png',
    hasTypes: false,
  },
  [DB.GENERIC]: {
    name: i18n.t('generic'),
    label: DB.GENERIC,
    image: null,
    description: i18n.t('generic_description'),
    hasTypes: true,
  },
} as const;

export const databases: {
  [key in DBValueType]: DBAttributeType;
} = new Proxy(databaseDefinitions, {
  get: (target, prop: DBValueType) => (prop in target ? target[prop] : {}),
});
