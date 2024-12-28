import { DB } from '@constants/editor';
import { dbToTypes } from 'src/data/datatypes';
import { isFunction, strHasQuotes } from 'src/utils/common';
import { isKeyword } from 'src/utils/drawdb';

export function parseDefault(field: any, database = DB.GENERIC) {
  if (
    strHasQuotes(field.default) ||
    isFunction(field.default) ||
    isKeyword(field.default) ||
    !dbToTypes[database][field.type].hasQuotes
  ) {
    return field.default;
  }

  return `'${field.default}'`;
}

export function exportFieldComment(comment: string) {
  if (comment === '') {
    return '';
  }

  return comment
    .split('\n')
    .map((commentLine) => `\t-- ${commentLine}\n`)
    .join('');
}

export function getInlineFK(table: any, obj) {
  const fks: string[] = [];
  obj.references.forEach((r) => {
    if (r.startTableId === table['id']) {
      fks.push(
        `\tFOREIGN KEY ("${table['fields'][r.startFieldId].name}") REFERENCES "${
          obj.tables[r.endTableId].name
        }"("${
          obj.tables[r.endTableId].fields[r.endFieldId].name
        }")\n\tON UPDATE ${r.updateConstraint.toUpperCase()} ON DELETE ${r.deleteConstraint.toUpperCase()}`,
      );
    }
  });
  return fks.join(',\n');
}
