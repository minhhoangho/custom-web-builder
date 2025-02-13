import { DB } from '@constants/editor';
import { strHasQuotes } from 'src/utils/common';
import {
  DBDataTypeAttributeType,
  DBValueType,
  DDataType,
  DField,
} from './interface';

const intRegex = /^-?\d*$/;
const doubleRegex = /^-?\d*.?\d+$/;
const binaryRegex = /^[01]+$/;

const defaultTypesBase = {
  INT: {
    type: 'INT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  SMALLINT: {
    type: 'SMALLINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  BIGINT: {
    type: 'BIGINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    isSized: false,
    hasCheck: true,
    hasPrecision: false,
    canIncrement: true,
  },
  DECIMAL: {
    type: 'DECIMAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  NUMERIC: {
    type: 'NUMERIC',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  FLOAT: {
    type: 'FLOAT',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  DOUBLE: {
    type: 'DOUBLE',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  REAL: {
    type: 'REAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
  },
  CHAR: {
    type: 'CHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  TEXT: {
    type: 'TEXT',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  TIME: {
    type: 'TIME',
    checkDefault: (field: DField) => {
      return /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMP: {
    type: 'TIMESTAMP',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const content = field.default.split(' ');
      const date = content[0]?.split('-');
      if (date?.length === 0 || date?.[0] === undefined) return false;
      return (
        Number.parseInt(date[0]) >= 1970 && Number.parseInt(date[0]) <= 2038
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATE: {
    type: 'DATE',
    checkDefault: (field: DField) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATETIME: {
    type: 'DATETIME',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const c: string[] = field.default.split(' ');
      if (c.length === 0) return false;
      const d: string[] = c[0]?.split('-') ?? [];
      if (d.length === 0) return false;
      return (
        Number.parseInt(d[0] ?? '0') >= 1000 &&
        Number.parseInt(d[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  BOOLEAN: {
    type: 'BOOLEAN',
    checkDefault: (field: DField) => {
      return (
        field.default.toLowerCase() === 'false' ||
        field.default.toLowerCase() === 'true' ||
        field.default === '0' ||
        field.default === '1'
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
  },
  BINARY: {
    type: 'BINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARBINARY: {
    type: 'VARBINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  BLOB: {
    type: 'BLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  JSON: {
    type: 'JSON',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  UUID: {
    type: 'UUID',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  ENUM: {
    type: 'ENUM',
    checkDefault: (field: DField) => {
      if (!field.values) return false;
      return field.values.includes(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  SET: {
    type: 'SET',
    checkDefault: (field: DField) => {
      const defaultValues = field.default.split(',');
      // for (let i = 0; i < defaultValues.length; i++) {
      //   if (!field.values.includes(defaultValues[i].trim())) return false;
      // }
      if (!field?.values) return false;
      for (const value of defaultValues) {
        if (!field.values.includes(value.trim())) return false;
      }
      return true;
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    noDefault: true,
  },
};

type TypeMapping = {
  [_key in DDataType]: {
    type: string;
    checkDefault: (field: DField) => boolean;
    hasCheck: boolean;
    isSized: boolean;
    hasPrecision: boolean;
    canIncrement?: boolean;
    compatibleWith?: DDataType[];
    defaultSize?: number;
    hasQuotes?: boolean;
    noDefault?: boolean;
  };
};

export const defaultTypes = new Proxy(defaultTypesBase, {
  get: (target, prop: string) => (prop in target ? target[prop] : false),
});

const mysqlTypesBase = {
  TINYINT: {
    type: 'TINYINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    signed: true,
  },
  SMALLINT: {
    type: 'SMALLINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    signed: true,
  },
  MEDIUMINT: {
    type: 'MEDIUMINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    signed: true,
  },
  INTEGER: {
    type: 'INTEGER',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    signed: true,
  },
  BIGINT: {
    type: 'BIGINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    signed: true,
  },
  DECIMAL: {
    type: 'DECIMAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  NUMERIC: {
    type: 'NUMERIC',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  FLOAT: {
    type: 'FLOAT',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  DOUBLE: {
    type: 'DOUBLE',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  BIT: {
    type: 'BIT',
    checkDefault: (field: DField) => {
      return field.default === '1' || field.default === '0';
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  BOOLEAN: {
    type: 'BOOLEAN',
    checkDefault: (field: DField) => {
      return (
        field.default.toLowerCase() === 'false' ||
        field.default.toLowerCase() === 'true' ||
        field.default === '0' ||
        field.default === '1'
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
  },
  TIME: {
    type: 'TIME',
    checkDefault: (field: DField) => {
      return /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMP: {
    type: 'TIMESTAMP',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const content = field.default.split(' ');
      const date = content?.[0]?.split('-');
      if (date?.length === 0 || date?.[0] === undefined) return false;
      return (
        Number.parseInt(date[0]) >= 1970 && Number.parseInt(date[0]) <= 2038
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATE: {
    type: 'DATE',
    checkDefault: (field: DField) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATETIME: {
    type: 'DATETIME',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1000 &&
        Number.parseInt(d?.[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  YEAR: {
    type: 'YEAR',
    checkDefault: (field: DField) => {
      return /^\d{4}$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
  },
  CHAR: {
    type: 'CHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  BINARY: {
    type: 'BINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARBINARY: {
    type: 'VARBINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  TINYBLOB: {
    type: 'TINYBLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  BLOB: {
    type: 'BLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  MEDIUMBLOB: {
    type: 'MEDIUMBLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  LONGBLOB: {
    type: 'LONGBLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  TINYTEXT: {
    type: 'TINYTEXT',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  TEXT: {
    type: 'TEXT',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  MEDIUMTEXT: {
    type: 'MEDIUMTEXT',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  LONGTEXT: {
    type: 'LONGTEXT',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  ENUM: {
    type: 'ENUM',
    checkDefault: (field: DField) => {
      return field.values?.includes(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  SET: {
    type: 'SET',
    checkDefault: (field: DField) => {
      const defaultValues = field.default.split(',');
      for (const value of defaultValues) {
        if (!field.values?.includes(value.trim())) return false;
      }
      return true;
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    noDefault: true,
  },
  GEOMETRY: {
    type: 'GEOMETRY',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  POINT: {
    type: 'POINT',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  LINESTRING: {
    type: 'LINESTRING',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  POLYGON: {
    type: 'POLYGON',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  MULTIPOINT: {
    type: 'MULTIPOINT',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  MULTILINESTRING: {
    type: 'MULTILINESTRING',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  MULTIPOLYGON: {
    type: 'MULTIPOLYGON',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  GEOMETRYCOLLECTION: {
    type: 'GEOMETRYCOLLECTION',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  JSON: {
    type: 'JSON',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
};

export const mysqlTypes = new Proxy(mysqlTypesBase, {
  get: (target, prop: string) => (prop in target ? target[prop] : false),
});

const postgresTypesBase = {
  SMALLINT: {
    type: 'SMALLINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    compatibleWith: ['SMALLSERIAL', 'SERIAL', 'BIGSERIAL', 'INTEGER', 'BIGINT'],
  },
  INTEGER: {
    type: 'INTEGER',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    compatibleWith: [
      'SMALLSERIAL',
      'SERIAL',
      'BIGSERIAL',
      'SMALLINT',
      'BIGINT',
    ],
  },
  BIGINT: {
    type: 'BIGINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
    compatibleWith: [
      'SMALLSERIAL',
      'SERIAL',
      'BIGSERIAL',
      'INTEGER',
      'SMALLINT',
    ],
  },
  DECIMAL: {
    type: 'DECIMAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  NUMERIC: {
    type: 'NUMERIC',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  REAL: {
    type: 'REAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  'DOUBLE PRECISION': {
    type: 'DOUBLE PRECISION',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  SMALLSERIAL: {
    type: 'SMALLSERIAL',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    compatibleWith: ['INTEGER', 'SERIAL', 'BIGSERIAL', 'SMALLINT', 'BIGINT'],
  },
  SERIAL: {
    type: 'SERIAL',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    compatibleWith: [
      'INTEGER',
      'SMALLSERIAL',
      'BIGSERIAL',
      'SMALLINT',
      'BIGINT',
    ],
  },
  BIGSERIAL: {
    type: 'BIGSERIAL',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    compatibleWith: ['INTEGER', 'SERIAL', 'SMALLSERIAL', 'SMALLINT', 'BIGINT'],
  },
  MONEY: {
    type: 'MONEY',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  CHAR: {
    type: 'CHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  TEXT: {
    type: 'TEXT',
    checkDefault: (field: DField) => {
      if (field.size === undefined) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  BYTEA: {
    type: 'BYTEA',
    checkDefault: (field: DField) => {
      return /^[0-9a-fA-F]*$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    defaultSize: null,
    hasQuotes: true,
  },
  DATE: {
    type: 'DATE',
    checkDefault: (field: DField) => {
      const specialValues = [
        'epoch',
        'infinity',
        '-infinity',
        'now',
        'today',
        'tomorrow',
        'yesterday',
      ];
      return (
        /^\d{4}-\d{2}-\d{2}$/.test(field.default) ||
        specialValues.includes(field.default.toLowerCase())
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIME: {
    type: 'TIME',
    checkDefault: (field: DField) => {
      const specialValues = ['now', 'allballs'];
      return (
        /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(field.default) ||
        specialValues.includes(field.default.toLowerCase())
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMETZ: {
    type: 'TIMETZ',
    checkDefault: (field: DField) => {
      const specialValues = ['now', 'allballs'];
      return (
        /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d([+-]\d{2}:\d{2})?$/.test(
          field.default,
        ) || specialValues.includes(field.default.toLowerCase())
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMP: {
    type: 'TIMESTAMP',
    checkDefault: (field: DField) => {
      const content = field.default.split(' ');
      const date = content[0]?.split('-');
      const specialValues = [
        'epoch',
        'infinity',
        '-infinity',
        'now',
        'today',
        'tomorrow',
        'yesterday',
        'current_timestamp',
      ];
      return (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default) ||
        (Number.parseInt(date?.[0] ?? '0') >= 1970 &&
          Number.parseInt(date?.[0] ?? '0') <= 2038) ||
        specialValues.includes(field.default.toLowerCase())
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMPTZ: {
    type: 'TIMESTAMPTZ',
    checkDefault: (field: DField) => {
      const specialValues = [
        'epoch',
        'infinity',
        '-infinity',
        'now',
        'today',
        'tomorrow',
        'yesterday',
        'current_timestamp',
      ];
      return (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$/.test(
          field.default,
        ) || specialValues.includes(field.default.toLowerCase())
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  INTERVAL: {
    type: 'INTERVAL',
    checkDefault: (field: DField) => /^['"\d\s\\-]+$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  BOOLEAN: {
    type: 'BOOLEAN',
    checkDefault: (field: DField) => /^(true|false)$/i.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  POINT: {
    type: 'POINT',
    checkDefault: (field: DField) => /^\(\d+,\d+\)$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  LINE: {
    type: 'LINE',
    checkDefault: (field: DField) =>
      /^(\(\d+,\d+\),)+\(\d+,\d+\)$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  LSEG: {
    type: 'LSEG',
    checkDefault: (field: DField) =>
      /^(\(\d+,\d+\),)+\(\d+,\d+\)$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  BOX: {
    type: 'BOX',
    checkDefault: (field: DField) =>
      /^\(\d+(\.\d+)?,\d+(\.\d+)?\),\(\d+(\.\d+)?,\d+(\.\d+)?\)$/.test(
        field.default,
      ),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  PATH: {
    type: 'PATH',
    checkDefault: (field: DField) =>
      /^\((\d+(\.\d+)?,\d+(\.\d+)?(,\d+(\.\d+)?,\d+(\.\d+)?)*?)\)$/.test(
        field.default,
      ),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  POLYGON: {
    type: 'POLYGON',
    checkDefault: (field: DField) =>
      /^\((\d+(\.\d+)?,\d+(\.\d+)?(,\d+(\.\d+)?,\d+(\.\d+)?)*?)\)$/.test(
        field.default,
      ),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  CIRCLE: {
    type: 'CIRCLE',
    checkDefault: (field: DField) =>
      /^<\(\d+(\.\d+)?,\d+(\.\d+)?\),\d+(\.\d+)?\\>$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  CIDR: {
    type: 'CIDR',
    checkDefault: (field: DField) =>
      /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  INET: {
    type: 'INET',
    checkDefault: (field: DField) =>
      /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  MACADDR: {
    type: 'MACADDR',
    checkDefault: (field: DField) =>
      /^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  MACADDR8: {
    type: 'MACADDR8',
    checkDefault: (field: DField) =>
      /^([A-Fa-f0-9]{2}:){7}[A-Fa-f0-9]{2}$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  BIT: {
    type: 'BIT',
    checkDefault: (field: DField) => /^[01]{1,}$/.test(field.default),
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: false,
  },
  VARBIT: {
    type: 'VARBIT',
    checkDefault: (field: DField) => /^[01]*$/.test(field.default),
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: false,
  },
  VECTOR: {
    type: 'VECTOR',
    checkDefault: (field: DField) => {
      let elements;
      let elementsStr = field.default;
      try {
        if (strHasQuotes(field.default)) {
          elementsStr = field.default.slice(1, -1);
        }
        elements = JSON.parse(elementsStr);
        if (!field.size) return false;
        return (
          Array.isArray(elements) &&
          elements.length === field.size &&
          elements.every(Number.isFinite)
        );
      } catch (e) {
        return false;
      }
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    hasQuotes: true,
  },
  HALFVEC: {
    type: 'HALFVEC',
    checkDefault: (field: DField) => {
      let elements;
      let elementsStr = field.default;
      try {
        if (strHasQuotes(field.default)) {
          elementsStr = field.default.slice(1, -1);
        }
        elements = JSON.parse(elementsStr);
        if (!field.size) return false;
        return (
          Array.isArray(elements) &&
          elements.length === field.size &&
          elements.every(Number.isFinite)
        );
      } catch (e) {
        return false;
      }
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    hasQuotes: true,
  },
  SPARSEVEC: {
    type: 'SPARSEVEC',
    checkDefault: (field: DField) => {
      let elementsStr = field.default;
      if (strHasQuotes(field.default)) {
        elementsStr = field.default.slice(1, -1);
      }
      const lengthStr = elementsStr.split('/')[1];
      const length = Number.parseInt(lengthStr as string);
      return length === field.size;
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    hasQuotes: true,
  },
  TSVECTOR: {
    type: 'TSVECTOR',
    checkDefault: (field: DField) => /^[A-Za-z0-9: ]*$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  TSQUERY: {
    type: 'TSQUERY',
    checkDefault: (field: DField) =>
      /^[A-Za-z0-9: &|!()]*$/.test(field.default),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
  },
  JSON: {
    type: 'JSON',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
  JSONB: {
    type: 'JSONB',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
  UUID: {
    type: 'UUID',
    checkDefault: (field: DField) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        field.default,
      ),
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
  XML: {
    type: 'XML',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
};

export const postgresTypes = new Proxy(postgresTypesBase, {
  get: (target, prop: string) => (prop in target ? target[prop] : false),
});

const sqliteTypesBase = {
  INTEGER: {
    type: 'INTEGER',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  REAL: {
    type: 'REAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  NUMERIC: {
    type: 'NUMERIC',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  BOOLEAN: {
    type: 'BOOLEAN',
    checkDefault: (field: DField) => {
      return (
        field.default.toLowerCase() === 'false' ||
        field.default.toLowerCase() === 'true' ||
        field.default === '0' ||
        field.default === '1'
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
  },
  VARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  TEXT: {
    type: 'TEXT',
    checkDefault: (_field: DField) => true,
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  BLOB: {
    type: 'BLOB',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  TIME: {
    type: 'TIME',
    checkDefault: (field: DField) => {
      return /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMP: {
    type: 'TIMESTAMP',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const content = field.default.split(' ');
      const date = content[0]?.split('-');
      return (
        Number.parseInt(date?.[0] ?? '0') >= 1970 &&
        Number.parseInt(date?.[0] ?? '0') <= 2038
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATE: {
    type: 'DATE',
    checkDefault: (field: DField) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATETIME: {
    type: 'DATETIME',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1000 &&
        Number.parseInt(d?.[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
};

export const sqliteTypes = new Proxy(sqliteTypesBase, {
  get: (target, prop: string) => (prop in target ? target[prop] : false),
});

const mssqlTypesBase = {
  TINYINT: {
    type: 'TINYINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  SMALLINT: {
    type: 'SMALLINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  INTEGER: {
    type: 'INTEGER',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  BIGINT: {
    type: 'BIGINT',
    checkDefault: (field: DField) => {
      return intRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
    canIncrement: true,
  },
  BIT: {
    type: 'BIT',
    checkDefault: (field: DField) => {
      return field.default === '1' || field.default === '0';
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  DECIMAL: {
    type: 'DECIMAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  NUMERIC: {
    type: 'NUMERIC',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  FLOAT: {
    type: 'FLOAT',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  DOUBLE: {
    type: 'DOUBLE',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  REAL: {
    type: 'REAL',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: false,
  },
  MONEY: {
    type: 'MONEY',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  SMALLMONEY: {
    type: 'MONEY',
    checkDefault: (field: DField) => {
      return doubleRegex.test(field.default);
    },
    hasCheck: true,
    isSized: false,
    hasPrecision: true,
  },
  DATE: {
    type: 'DATE',
    checkDefault: (field: DField) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATETIME: {
    type: 'DATETIME',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1000 &&
        Number.parseInt(d?.[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  DATETIME2: {
    type: 'DATETIME2',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1000 &&
        Number.parseInt(d?.[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: true,
    hasQuotes: true,
  },
  DATETIMEOFFSET: {
    type: 'DATETIMEOFFSET',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (
        !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{1,7})?([+-]\d{2}:\d{2})?$/.test(
          field.default,
        )
      ) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1000 &&
        Number.parseInt(d?.[0] ?? '0') <= 9999
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: true,
    hasQuotes: true,
  },
  SMALLDATETIME: {
    type: 'SMALLDATETIME',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(field.default)) {
        return false;
      }
      const c = field.default.split(' ');
      const d = c[0]?.split('-');
      return (
        Number.parseInt(d?.[0] ?? '0') >= 1900 &&
        Number.parseInt(d?.[0] ?? '0') <= 2079
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIME: {
    type: 'TIME',
    checkDefault: (field: DField) => {
      return /^(?:[01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.test(field.default);
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  TIMESTAMP: {
    type: 'TIMESTAMP',
    checkDefault: (field: DField) => {
      if (field.default.toUpperCase() === 'CURRENT_TIMESTAMP') {
        return true;
      }
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(field.default)) {
        return false;
      }
      const content = field.default.split(' ');
      const date = content[0]?.split('-');
      return (
        Number.parseInt(date?.[0] ?? '0') >= 1970 &&
        Number.parseInt(date?.[0] ?? '0') <= 2038
      );
    },
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
  },
  CHAR: {
    type: 'CHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  TEXT: {
    type: 'TEXT',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  NCHAR: {
    type: 'CHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  NVARCHAR: {
    type: 'VARCHAR',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      if (strHasQuotes(field.default)) {
        return field.default.length - 2 <= Number(field.size);
      }
      return field.default.length <= Number(field.size);
    },
    hasCheck: true,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  NTEXT: {
    type: 'TEXT',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 65535,
    hasQuotes: true,
  },
  BINARY: {
    type: 'BINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 1,
    hasQuotes: true,
  },
  VARBINARY: {
    type: 'VARBINARY',
    checkDefault: (field: DField) => {
      if (!field.size) return false;
      return (
        field.default.length <= Number(field.size) &&
        binaryRegex.test(field.default)
      );
    },
    hasCheck: false,
    isSized: true,
    hasPrecision: false,
    defaultSize: 255,
    hasQuotes: true,
  },
  IMAGE: {
    type: 'IMAGE',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
  UNIQUEIDENTIFIER: {
    type: 'UNIQUEIDENTIFIER',
    checkDefault: (_field: DField) => true,
    isSized: false,
    hasCheck: false,
    hasPrecision: false,
    noDefault: true,
  },
  XML: {
    type: 'XML',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
  CURSOR: {
    type: 'CURSOR',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
    noDefault: true,
  },
  SQL_VARIANT: {
    type: 'SQL_VARIANT',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: false,
    noDefault: true,
  },
  JSON: {
    type: 'JSON',
    checkDefault: (_field: DField) => true,
    hasCheck: false,
    isSized: false,
    hasPrecision: false,
    hasQuotes: true,
    noDefault: true,
  },
};

export const mssqlTypes = new Proxy(mssqlTypesBase, {
  get: (target, prop: string) => (prop in target ? target[prop] : false),
});

const dbToTypesBase: {
  [key in DBValueType]: {
    [_key in DDataType]: DBDataTypeAttributeType;
  };
} = {
  [DB.GENERIC]: defaultTypes,
  [DB.MYSQL]: mysqlTypes,
  [DB.POSTGRES]: postgresTypes,
  [DB.SQLITE]: sqliteTypes,
  [DB.MSSQL]: mssqlTypes,
  [DB.MARIADB]: mysqlTypes,
} as any;

export const dbToTypes = new Proxy(dbToTypesBase, {
  get: (target, prop: DBValueType) => (prop in target ? target[prop] : false),
});
