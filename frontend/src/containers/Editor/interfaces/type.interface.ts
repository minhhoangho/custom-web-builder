import { ObjectType } from '@constants/editor';

export interface EditorTypeInterface {
  id?: number;
  name: string;
  fields: any[];
  comment: string;
  element?: (typeof ObjectType)[keyof typeof ObjectType];
}
