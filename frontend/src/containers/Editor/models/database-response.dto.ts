import {
  DArea,
  DBValueType,
  DEnum,
  DNote,
  DRelationship,
  DTable,
  DTemplate,
  DType,
} from 'src/data/interface';

export interface DatabaseDetailResponse {
  id: number;
  gistId: string;
  loadedFromGistId: string;
  name: string;
  description?: string;
  database: DBValueType;
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
  createdAt: string;
  updatedAt: string;
}
