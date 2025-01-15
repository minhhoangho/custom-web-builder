import { UserData } from 'src/containers/UserManagement/models';
import { create } from 'zustand'

export type Role = {
  id: number;
  name: string;
  key: string;
};

export type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  role: Role;
  email: string;
};

export const useUserStore = create((set) => ({
  user: {} as UserInfo | UserData,
  setCurrentUser: (user) => set({ user }),
  clearUser: () => set({ user: {} as UserInfo | UserData }),
}));
