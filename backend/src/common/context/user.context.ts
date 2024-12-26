import { AsyncLocalStorage } from 'async_hooks';
import { User } from '@app/user/entities/user.entity';

export const CurrentUserContext = {
  storage: new AsyncLocalStorage<User>(),
  get() {
    return this.storage.getStore();
  },
  set(user: User) {
    return this.storage.enterWith(user);
  },
};
