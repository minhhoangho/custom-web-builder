import { genSaltSync, compare, hashSync } from 'bcryptjs';
import slugify from 'slugify';
import * as pluralize from 'pluralize';
import moment from 'moment';
import { FindOperator, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import {
  floor,
  isArray,
  isEmpty,
  map,
  random,
  reduce,
  snakeCase,
} from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param password The password that needs to be hashed
 * @Usage This function is used to hash the password with bcrypt
 */
export const hashPassword = (password: string): string => {
  const salt = genSaltSync();
  return hashSync(password, salt);
};
/**
 * @param password The password in plain text
 * @param hash The password in hash
 * @Usage This function is used to compare the password in plain text and hash
 */
export const compareHashPassword = async (
  password: string,
  hashText: string,
): Promise<boolean> => compare(password, hashText);

export const createSlug = (data: string) => slugify(data, { locale: 'vi' });

export const createSlugWithFullDateTime = (data: string) =>
  `${createSlug(data)}-${moment().format('YYYYMMDDHHmmssSS')}`;

export const getTTL = (responseType): number => {
  switch (responseType) {
    case 'reset_password':
      return 24 * 3600; // 1 day
    case 'not_remember_me':
      return 6 * 3600; // 6 hours
    default:
      return 14 * 24 * 3600; // 2 weeks
  }
};

/**
 * Generate random string
 * @param length
 * @param type mix|numeric
 * @returns {string}
 */
export const generateRandStr = (length, type = 'mix') => {
  let characters;
  if (type === 'mix') {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  } else if (type === 'numeric') {
    characters = '0123456789';
  } else if (type === 'mixCase') {
    characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Helper function to clean object
 * Note: This function will remove undefined, empty object {}
 * @param object
 * @returns {void}
 */
export const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    // Get this value and its type
    const value = obj[key];
    const type = typeof value;
    if (type === 'object') {
      // Recurse...
      cleanObject(value);
      // ...and remove if now "empty" if object is {}
      if (!Object.keys(value).length) {
        delete obj[key];
      }
    } else if (type === 'undefined') {
      // Undefined, remove it
      delete obj[key];
    }
  });
};

export const escapeString = (string: string) =>
  string.replace(/\\/g, '\\\\\\\\').replace(/[.*+?^${}|[\]'"]/g, '\\$&');

export const convertMysqlValue = (value: any) =>
  typeof value === 'string' ? `'${escapeString(value)}'` : value;

export const mapOperatorToString = (operator: FindOperator<any>): string => {
  if (operator?.child instanceof FindOperator)
    return `${operator.type} ${mapOperatorToString(operator.value)}`;

  switch (operator.type) {
    case 'like':
    case 'ilike':
    case 'not':
      return `${operator.type} ${convertMysqlValue(operator.value)}`;
    case 'equal':
      return `= ${convertMysqlValue(operator.value)}`;
    case 'between':
      return `between ${convertMysqlValue(
        operator.value[0],
      )} AND ${convertMysqlValue(operator.value[1])}`;
    case 'in':
      return `in (${map(operator.value as any, (element) =>
        convertMysqlValue(element),
      ).join(',')})`;
    case 'isNull':
      return 'is null';
    case 'lessThan':
      return `< ${convertMysqlValue(operator.value)}`;
    case 'lessThanOrEqual':
      return `<= ${convertMysqlValue(operator.value)}`;
    case 'moreThan':
      return `> ${convertMysqlValue(operator.value)}`;
    case 'moreThanOrEqual':
      return `>= ${convertMysqlValue(operator.value)}`;
    default:
      return `= ${convertMysqlValue(operator)}`;
  }
};

export const convertConditionToString = (
  where:
    | string
    | FindOptionsWhere<any>
    | FindOptionsWhere<any>[]
    | ObjectLiteral,
  alias: string,
): string => {
  // Or operator for FindConditions<T>[] condition type
  if (isArray(where)) {
    /**
     *  We're here
     *     ↓
     * someField: [
     *  subField: Like() | Equal() | ...
     * ]
     */
    return map(
      where,
      (condition) => `(${convertConditionToString(condition, alias)})`,
    ).join(' OR ');
    // eslint-disable-next-line no-else-return
  } else if (typeof where === 'object') {
    return reduce(
      where,
      (acc: string[], operator: any, field: string) => {
        /**
         * someField: {
         *  We're here
         *     ↓
         *  subField: []
         * }
         */
        if (isArray(operator))
          acc.push(`(${convertConditionToString(operator, alias)})`);
        else if (
          typeof operator === 'object' &&
          !(operator instanceof FindOperator)
        ) {
          /**
           * someField: {
           *  We're here
           *     ↓
           *  relationName: { relationField: Like() | Equal() | ... }
           * }
           */
          acc.push(convertConditionToString(operator, field));
        } else {
          /**
           *  We're here
           *     ↓
           * someField: Like() | Equal() | ...
           */
          acc.push(
            `(${`${alias}.${snakeCase(field)}`} ${mapOperatorToString(
              operator,
            )})`,
          );
        }
        return acc;
      },
      [],
    ).join(' AND ');
  }

  return where;
};

export const generateUniqueAccessToken = () =>
  `${uuidv4()}-${new Date().getTime()}`;

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

/**
 * Get UC UCODE1取得
 */
export const getUc1 = () => {
  let uc = 0;
  const dYear = Number(moment().format('YYYY'));
  const dMonth = Number(moment().format('MM'));
  const dDate = Number(moment().format('DD'));
  const dHour = Number(moment().format('HH'));
  const dMin = Number(moment().format('mm'));
  const dSec = Number(moment().format('ss'));
  const dMil = Number(moment().format('SSS'));

  uc += dSec + floor(random(0, 9));
  uc += dDate + dSec + dMil;
  uc += dMonth + floor(random(0, 9));
  uc += dYear - 1500 - dMonth - dSec;
  uc += dDate + dSec;
  uc += dMil + floor(random(0, 9));
  uc += dYear - 2000 + dSec;
  uc += dMin + 30;
  uc += dHour + floor(random(0, 9));

  // Return
  return uc;
};

/**
 * Encode nt to ht 数列を文字列に変換
 *
 * @param pText
 * @return string
 */
export const encodeNtToHt = (pText: string) => {
  const dHash = [
    ['g', 'e', 't', 'h', 'j', 'q', 'w', 'r', 'm', 'x'],
    ['o', 'f', 'a', 'y', 'i', 'n', 'z', 'b', 'v', 'l'],
    ['s', 'd', 'u', 'c', 'p', 'k', 'w', 'b', 'm', 'l'],
  ];
  let result = '';
  for (let l = 0, len = pText.length; l < len; l += 1) {
    result += dHash[random(0, 2)][Number(pText[l])];
  }

  return result;
};

/**
 * CharCodeAt
 *
 * @param text
 * @description append charCodeAt in single byte of utf8 text
 * @return string
 */
export const charCodeAt = (text: string) => {
  let offset = 0;

  let str = '';
  while (offset >= 0) {
    /**
     * Convert ord utf-8
     * */
    let bytesnumber: number;
    let code2: number;

    let code = unescape(encodeURIComponent(text))
      .substr(offset, 1)
      .charCodeAt(0);
    if (code >= 128) {
      bytesnumber = Buffer.byteLength(text);
      let codetemp =
        code - 192 - (bytesnumber > 2 ? 32 : 0) - (bytesnumber > 3 ? 16 : 0);
      for (let i = 2; i <= bytesnumber; i += 1) {
        offset += 1;
        code2 =
          unescape(encodeURIComponent(text)).substr(offset, 1).charCodeAt(0) -
          128;
        codetemp = codetemp * 64 + code2; // 10xxxxxx
      }
      code = codetemp;
    }
    offset += 1;
    if (offset >= text.length) offset = -1;

    str += code;
  }

  return str;
};

/**
 * Encode 暗号化
 *
 * @param pText
 * @param pId
 * @return null
 */
export const encode = (pText: string, pId: number): any => {
  if (isEmpty(pText)) return '';
  const dKey = pId * 208 + 1793;
  let dCode = '';
  let dCodeText = '';

  for (let l = 0, len = pText.length; l < len; l += 1) {
    // dCode = "000000" + ($this -> char_code_at(mb_substr($p_text, $l, 1)) + $d_key);
    dCode = `000000${Number(charCodeAt(pText.substr(l, 1))) + dKey}`;
    dCode = dCode.substr(dCode.length - 6, 6);
    dCodeText += random(0, 9) + dCode + random(0, 9);
  }
  return encodeNtToHt(random(0, 9) + dCodeText);
};

export const convertToPluralNoun = (noun: string) => pluralize(noun, 2);
