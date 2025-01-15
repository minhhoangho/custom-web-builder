import { create } from 'zustand';
import { ConfirmType } from '@constants/common';

export type ConfirmBoxType = {
  type: (typeof ConfirmType)[keyof typeof ConfirmType];
  reverse: boolean;
  show: boolean;
  title: string;
  message: string;
  confirmButtonLabel: string;
  confirmButtonVariant: string;
  contentClassName: string;
};

export const defaultConfirmBox = {
  type: ConfirmType.YesNo,
  reverse: false,
  show: false,
  title: '',
  message: '',
  confirmButtonLabel: '',
  confirmButtonVariant: 'primary',
  contentClassName: '',
};

export const useConfirmBoxStore = create<{
  confirmBox: ConfirmBoxType;
  setConfirmBox: (confirmBox: ConfirmBoxType) => void;
}>((set) => ({
  confirmBox: defaultConfirmBox,
  setConfirmBox: (confirmBox: ConfirmBoxType) => set({ confirmBox }),
}));
