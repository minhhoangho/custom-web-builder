import { Roles } from '@common/constants/common';

export class LoginInterface {
  email: string;

  password: string;

  role: Roles;
}
