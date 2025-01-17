import Cookies, { CookieSetOptions } from 'universal-cookie';
import addSeconds from 'date-fns/addSeconds';
import { getCurrentDomain } from 'src/utils';
import { CookieKey } from '@constants/storage';

const cookies = new Cookies();
export const CookieStorage = {
  getCookieData(key: string) {
    return cookies.get(key);
  },

  setCookieData(
    key: string,
    data: string | number | null | undefined | Record<string, any>,
    expirationTime: number,
    path?: string,
  ) {
    const domain = getCurrentDomain();
    const expires = expirationTime
      ? addSeconds(new Date(), expirationTime)
      : undefined;
    return cookies.set(key, data, { domain, expires, path: path ?? '/' } as CookieSetOptions);
  },

  clearCookieData(key: string, path = '/') {
    const domain = getCurrentDomain();
    return cookies.remove(key, { domain, path });
  },
  getAccessToken() {
    return cookies.get(CookieKey.AccessToken);
  },
  isAuthenticated() {
    const accessToken = cookies.get(CookieKey.AccessToken);
    return !!accessToken;
  },
  clearSession() {
    this.clearCookieData(CookieKey.AccessToken);
    this.clearCookieData(CookieKey.UserInfo);
  },
};
