import { Action, ObjectType } from '@constants/editor';

export interface EditorRedoStackInterface {}
export interface EditorUndoStackInterface {
  action: (typeof Action)[keyof typeof Action];
  element: (typeof ObjectType)[keyof typeof ObjectType];
  aid: string; // Assuming `areaResize.id` is a string
  undo: {
    x: number;
    y: number;
    width: number;
    height: number;
    [key: string]: any; // To include other properties from `areas[areaResize.id]`
  };
  redo: {
    [key: string]: any; // To include properties from `areas[areaResize.id]`
  };
  message: string;
}
