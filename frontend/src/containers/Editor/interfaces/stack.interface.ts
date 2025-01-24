import { Action, ObjectType } from '@constants/editor';

interface UndoInterface {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface EditorRedoStackInterface {
  action: (typeof Action)[keyof typeof Action];
  element: (typeof ObjectType)[keyof typeof ObjectType];
  aid: string; // Assuming `areaResize.id` is a string
  undo: Partial<UndoInterface>;
  redo: {
    x: number;
    y: number;
    width: number;
    height: number;
    [key: string]: any; // To include other properties from `areas[areaResize.id]`
  };
  message: string;
}
export interface EditorUndoStackInterface {
  action: (typeof Action)[keyof typeof Action];
  element: (typeof ObjectType)[keyof typeof ObjectType];
  component: string;
  tid: number;
  aid: number;
  undo: Partial<UndoInterface>;
  redo: {
    color: string;
    [key: string]: any; // To include properties from `areas[areaResize.id]`
  };
  message: string;
}
