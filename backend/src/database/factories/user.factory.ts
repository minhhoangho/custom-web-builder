import { fakerEN } from '@faker-js/faker';

import { User } from '@app/entity';
import { hashPassword } from '@utils';
import { define } from 'typeorm-seeding';

define(User, (faker: typeof fakerEN, context: { email: string }): User => {
  const user = new User();

  user.firstName = fakerEN.person.firstName();
  user.lastName = fakerEN.person.lastName();
  user.email =
    context?.email ||
    fakerEN.internet.email({
      firstName: user.firstName.toLowerCase(),
      lastName: user.lastName.toLowerCase(),
    });
  user.avatar = `https://i.pravatar.cc/150?u=${Math.random()
    .toString(36)
    .substring(4, 20)}`;
  user.password = hashPassword('123456');
  user.roleId = 3;
  return user;
});
