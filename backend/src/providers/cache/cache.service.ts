import loadConfig from 'src/configs';
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisCacheService {
  private cache;

  constructor() {
    console.log("loadConfig.redis.host", loadConfig.redis)
    this.cache = createClient({
      socket: {
        host: loadConfig.redis.host,
        port: loadConfig.redis.port,
      },
      password: loadConfig.redis.password,
      database: 0,
    });
    this.cache.connect();
    this.cache
      .on('error', () => Logger.error('Cannot connect Redis', 'Database'))
      .on('connected', () =>
        Logger.log('Redis is connected successfully', 'Database'),
      );
  }

  public isConnected() {
    return this.cache.connected;
  }

  private defaultTTL = 60 * 60 * 24 * 365;

  async exists(key: string): Promise<boolean> {
    return this.cache.exists(key);
  }

  async set(key: string, value: any): Promise<boolean> {
    return this.cache.set(key, value);
  }

  async get(key: string) {
    return promisify(this.cache.get).bind(this.cache)(key);
  }

  async del(key: string) {
    return this.cache.del(key);
  }

  async hashSet(key, field, value) {
    return this.cache.hset(key, field, value);
  }

  async hashDel(key, field) {
    return this.cache.hdel(key, field);
  }

  async hashGet(key, field) {
    const getPromise = promisify(this.cache.hget).bind(this.cache);
    return getPromise(key, field);
  }

  async hashExists(key, field) {
    return promisify(this.cache.hexists).bind(this.cache)(key, field);
  }

  async expires(key, timeout = this.defaultTTL) {
    return this.cache.expire(key, timeout);
  }

  async getTTL(key) {
    return promisify(this.cache.ttl).bind(this.cache)(key);
  }

  async sadd(key: string, value: string) {
    return this.cache.sadd(key, value);
  }

  async srem(key: string, value: string) {
    return this.cache.srem(key, value);
  }

  async smembers(key: string) {
    return promisify(this.cache.smembers).bind(this.cache)(key);
  }
}
