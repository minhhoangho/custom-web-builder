import { Action, ObjectType } from '@constants/editor';
import {
  DArea,
  DField,
  DNote,
  DRelationship,
  DTable,
} from '../../../data/interface';

export interface EditorRedoStackInterface {
  action: (typeof Action)[keyof typeof Action];
  element: (typeof ObjectType)[keyof typeof ObjectType];
  tid: number;
  aid: number;
  fid: number;
  nid: number;
  undo: {
    [key: string]: any; // To include other properties from `areas[areaResize.id]`
  };
  redo: {
    [key: string]: any; // To include other properties from `areas[areaResize.id]`
  };
  message: string;
  data:
    | Partial<{
        relationship: DRelationship[];
        table: DTable;
        field: DField;
      }>
    | DRelationship
    | DArea
    | DNote;

  toX: number;
  toY: number;
  x: number;
  y: number;
  id: number;
  endFieldId: number;
  startFieldId: number;
}

export interface EditorUndoStackInterface {
  action: (typeof Action)[keyof typeof Action];
  element: (typeof ObjectType)[keyof typeof ObjectType];
  component: string;
  tid: number;
  aid: number;
  fid: number;
  nid: number;
  undo: {
    [key: string]: any; // To include properties from `areas[areaResize.id]`
  };
  redo: {
    [key: string]: any; // To include properties from `areas[areaResize.id]`
  };
  message: string;
  data:
    | Partial<{
        relationship: DRelationship[];
        table: DTable;
        field: DField;
      }>
    | DRelationship
    | DArea
    | DNote;
  toX: number;
  toY: number;
  x: number;
  y: number;
  id: number;
  endFieldId: number;
  startFieldId: number;
}
