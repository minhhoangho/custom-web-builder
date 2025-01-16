import { ObjectType } from '@constants/editor';

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
  type: string;
  default: string;
  check: string;
  primary: boolean;
  unique: boolean;
  notNull: boolean;
  increment: boolean;
  comment: string;
  id: number;
  size?: number | string; // optional, as not all fields have a size
  values?: any[]; // optional, as not all fields have values
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
  startTableId: number;
  startFieldId: number;
  endTableId: number;
  endFieldId: number;
  name: string;
  cardinality: string;
  updateConstraint: string;
  deleteConstraint: string;
  id: number;
}

export interface DTemplate {
  id?: number;
  database: string;
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
