import { create } from 'zustand'
import { ConfirmType } from '@constants/common';


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

export const useConfirmBoxStore = create((set) => ({
  confirmBox: defaultConfirmBox,
  setConfirmBox: (confirmBox) => set({ confirmBox }),
}))