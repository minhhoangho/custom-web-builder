import { Roles } from '@common/constants/common';
import { hashSync } from 'bcryptjs';

export const adminDatas = [
  {
    email: 'admin@test.vn',
    name: 'admin',
    password: hashSync('12345678', 10)
  }
];

export const roleDatas = [
  {
    name: Roles.ADMIN
  },
  {
    name: Roles.USER
  }
];
