import { hashPassword } from '@utils';

export const DefaultUserData = [
  {
    email: 'admin@gmail.com',
    firstName: 'System',
    lastName: 'Admin',
    password: hashPassword('123456'),
    avatar:
      'https://cdn1.iconfinder.com/data/icons/marketing-19/100/Profile-512.png',
    roleId: 1,
  },
  {
    email: 'moderator@gmail.com',
    firstName: 'System',
    lastName: 'Moderator',
    password: hashPassword('123456'),
    avatar:
      'https://cdn1.iconfinder.com/data/icons/marketing-19/100/Profile-512.png',
    roleId: 2,
  },
  {
    email: 'user1@gmail.com',
    firstName: 'Normal',
    lastName: 'User',
    password: hashPassword('123456'),
    avatar:
      'https://cdn1.iconfinder.com/data/icons/marketing-19/100/Profile-512.png',
    roleId: 3,
  },
];
