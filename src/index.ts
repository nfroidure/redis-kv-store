import { autoService } from 'knifecycle';
import type { LogService } from 'common-services';
import type { KVStoreService } from 'memory-kv-store';
import type { RedisService } from 'simple-redis-service';

/* Architecture Note #1: Redis Key/Value Service

A `redis` based key/value service.
*/

export type RedisKVService<T> = KVStoreService<T>;
export type RedisKVDependencies = {
  redis: RedisService;
  log: LogService;
};

export default autoService(initRedisKV);

/**
 * Instantiate the Redis Key/Value service
 * @name initRedisKV
 * @function
 * @param  {Object}     services
 * The services to inject
 * @param  {Function}   services.redis
 * A `simple-redis-service` instance
 * @param  {Function}   services.log
 * A logging function
 * @return {Promise<RedisKVService>}
 * A promise of the Redis Key Value service
 * @example
 * import initRedisService from 'simple-redis-service';
 * import initRedisKV from 'redis-kv-store';
 *
 * const redis = await initRedisService({
 *   REDIS: {
 *     host: 'localhost',
 *     port: 6379,
 *   },
 *   ENV: process.env,
 *   log: console.log.bind(console),
 * });
 * const redisKV = await initRedisKV({
 *   redis,
 *   log: console.log.bind(console),
 * });
 *
 * const value = await redisKV.get('my_key');
 */
async function initRedisKV<T>({
  redis,
  log,
}: RedisKVDependencies): Promise<KVStoreService<T>> {
  log('warning', `🏧 - Redis KV Store Service initialized!`);

  const redisKV = {
    get: async (key: string): Promise<T | undefined> => {
      const result = await redis.get(key);
      return castRedisResult<T>(result);
    },
    set: async (
      key: string,
      value: T | undefined,
      ttl?: number,
    ): Promise<void> => {
      if (typeof ttl !== 'undefined') {
        await redis.set(key, prepareRedisValue<T>(value), 'PX', ttl);
      } else {
        await redis.set(key, prepareRedisValue<T>(value));
      }
    },
    delete: async (key: string): Promise<void> => {
      await redis.del(key);
    },
    bulkGet: async (keys: string[]): Promise<(T | undefined)[]> => {
      return (await redis.mget(keys)).map((result) =>
        castRedisResult<T>(result),
      );
    },
    bulkSet: async (
      keys: string[],
      values: (T | undefined)[],
      ttls: number[] = [],
    ) => {
      await Promise.all(
        keys.map((key, index) => {
          const value = values[index];

          return redisKV.set(key, value, ttls[index]);
        }),
      );
    },
    bulkDelete: async (keys: string[]) => {
      await redis.del(...keys);
    },
  };

  return redisKV;
}

function castRedisResult<T>(result: string | null | undefined): T {
  return result == null || result === '' ? undefined : JSON.parse(result);
}

function prepareRedisValue<T>(value: T | undefined): string {
  return value == null ? '' : JSON.stringify(value);
}
