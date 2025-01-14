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
  tables: DTable[];
  relationships: DRelationship[];
  notes: any[]; // assuming notes can be of any type
  subjectAreas: any[]; // assuming subjectAreas can be of any type
  types: any[]; // assuming types can be of any type
  title: string;
  description?: string;
  custom: number;
}