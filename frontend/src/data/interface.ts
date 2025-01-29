import { DB, ObjectType } from '@constants/editor';
import {
  defaultTypes,
  mssqlTypes,
  mysqlTypes,
  postgresTypes,
  sqliteTypes,
} from './datatypes';

export type DDataType =
  | keyof typeof defaultTypes
  | keyof typeof mysqlTypes
  | keyof typeof postgresTypes
  | keyof typeof sqliteTypes
  | keyof typeof mssqlTypes;

export type DBType = (typeof DB)[keyof typeof DB];
export type DBConstType = keyof typeof DB;

export interface DType {
  id?: number;
  name: string;
  fields: any[];
  comment: string;
  element?: (typeof ObjectType)[keyof typeof ObjectType];
}

export interface DEnum {
  id?: number;
  name: string;
  values: string[];
}

export interface DNote {
  id: number;
  x: number;
  y: number;
  title: string;
  content: string;
  color: string;
  height: number;
}

export interface DArea {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface DField {
  name: string;
  type: DDataType;
  default: string;
  check: string;
  primary: boolean;
  unique: boolean;
  notNull: boolean;
  increment: boolean;
  comment: string;
  id: number;
  size?: number; // optional, as not all fields have a size
  values?: any[]; // optional, as not all fields have values
  isArray?: boolean; // optional, as not all fields are arrays
}

export interface DIndex {
  name: string;
  unique: boolean;
  fields: string[];
}

export interface DTable {
  id: number;
  name: string;
  x: number;
  y: number;
  fields: DField[];
  comment: string;
  indices: any[]; // assuming indices can be of any type
  color: string;
  key?: number;
}

export interface DRelationship {
  id: number;
  startTableId: number;
  startFieldId: number;
  endTableId: number;
  endFieldId: number;
  name: string;
  cardinality: string;
  updateConstraint: string;
  deleteConstraint: string;
}

export interface DTemplate {
  id?: number;
  database: DBType;
  tables: DTable[];
  relationships: DRelationship[];
  notes: DNote[]; // assuming notes can be of any type
  subjectAreas: DArea[]; // assuming subjectAreas can be of any type
  title: string;
  description?: string;
  custom: number;
  types?: DType[];
  enums?: DEnum[];
  todos?: any[]; // assuming todos can be of any type
}

export interface DDiagram {
  id: number;
  gistId: string;
  loadedFromGistId: string;
  name: string;
  description?: string;
  database: string;
  tables: DTable[];
  references: DRelationship[];
  template?: DTemplate;
  subjectAreas?: any[]; // assuming subjectAreas can be of any type
  notes: DNote[]; // assuming notes can be of any type
  areas: DArea[]; // assuming areas can be of any type
  todos: any[]; // assuming todos can be of any type
  types: DType[];
  enums: DEnum[];
  pan: { x: number; y: number };
  zoom: number;
  lastModified: Date;
}
