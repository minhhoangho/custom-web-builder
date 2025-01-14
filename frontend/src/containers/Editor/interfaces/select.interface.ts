import { ObjectType, Tab } from '@constants/editor';

export interface EditorSelectInterface {
  element: (typeof ObjectType)[keyof typeof ObjectType];
  id: number;
  openDialogue: boolean;
  openCollapse: boolean;
  currentTab: (typeof Tab)[keyof typeof Tab];
  open: boolean;
  openFromToolbar: boolean;
}
