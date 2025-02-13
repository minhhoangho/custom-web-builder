import { AST } from 'node-sql-parser';
import {
  DB,
  tableColorStripHeight,
  tableFieldHeight,
  tableHeaderHeight,
} from '@constants/editor';
import { fromMariaDB } from './mariadb';
import { fromMSSQL } from './mssql';
import { fromMySQL } from './mysql';
import { fromPostgres } from './postgres';
import { fromSQLite } from './sqlite';
import {
  DBValueType,
  DEnum,
  DRelationship,
  DTable,
  DType,
} from '../../../data/interface';

export function importSQL(
  ast: AST | AST[],
  toDb: DBValueType = DB.MYSQL,
  diagramDb: DBValueType = DB.GENERIC,
): {
  tables: DTable[];
  relationships: DRelationship[];
  types?: DType[];
  enums?: DEnum[];
} {
  let diagram;
  switch (toDb) {
    case DB.SQLITE:
      diagram = fromSQLite(ast, diagramDb);
      break;
    case DB.MYSQL:
      diagram = fromMySQL(ast, diagramDb);
      break;
    case DB.POSTGRES:
      diagram = fromPostgres(ast, diagramDb);
      break;
    case DB.MARIADB:
      diagram = fromMariaDB(ast, diagramDb);
      break;
    case DB.MSSQL:
      diagram = fromMSSQL(ast, diagramDb);
      break;
    default:
      diagram = { tables: [], relationships: [] };
      break;
  }

  let maxHeight = -1;
  const tableWidth = 200;
  const gapX = 54;
  const gapY = 40;
  diagram.tables.forEach((table, i) => {
    if (i < diagram.tables.length / 2) {
      table.x = i * tableWidth + (i + 1) * gapX;
      table.y = gapY;
      const height =
        table.fields.length * tableFieldHeight +
        tableHeaderHeight +
        tableColorStripHeight;
      maxHeight = Math.max(height, maxHeight);
    } else {
      const index = diagram.tables.length - i - 1;
      table.x = index * tableWidth + (index + 1) * gapX;
      table.y = maxHeight + 2 * gapY;
    }
  });

  return diagram;
}
