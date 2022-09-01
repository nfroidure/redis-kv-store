import {
  describe,
  beforeEach,
  afterEach,
  test,
  jest,
  expect,
} from '@jest/globals';
import { constant, Knifecycle } from 'knifecycle';
import initRedisKVService from './index.js';
import initRedisService from 'simple-redis-service';
import type { RedisKVService } from './index.js';
import type { RedisConfig } from 'simple-redis-service';
import type { LogService } from 'common-services';

describe('Redis service', () => {
  let $: Knifecycle;
  const log = jest.fn<LogService>();

  beforeEach(() => {
    log.mockReset();
    $ = new Knifecycle();
    $.register(constant('ENV', {}));
    $.register(constant('log', log));
    $.register(
      constant('REDIS', {
        host: 'localhost',
        port: 6379,
      } as RedisConfig),
    );
    $.register(initRedisService);
    $.register(initRedisKVService);
  });

  afterEach(async () => {
    await $.destroy();
  });

  test('should init well', async () => {
    const { redisKV } = (await $.run(['redisKV'])) as {
      redisKV: RedisKVService<unknown>;
    };

    expect(typeof redisKV.get).toEqual('function');
    expect(typeof redisKV.set).toEqual('function');
    expect(log.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "warning",
          "🏧 - Redis Service initialized!",
        ],
        [
          "warning",
          "🏧 - Redis KV Store Service initialized!",
        ],
      ]
    `);
  });

  test('should allow to get a undefined value by its key', async () => {
    const { redisKV } = (await $.run(['redisKV'])) as {
      redisKV: RedisKVService<number>;
    };

    const value = await redisKV.get('lol');

    expect(value).toEqual(undefined);
  });

  ['trololol', { lol: 'lol' }, 1, true].forEach((value) => {
    test(
      'should allow to set and get a ' + typeof value + ' by its key',
      async () => {
        const { redisKV } = (await $.run(['redisKV'])) as {
          redisKV: RedisKVService<typeof value>;
        };

        await redisKV.set('lol', value);

        const retrievedValue = await redisKV.get('lol');

        expect(retrievedValue).toEqual(value);
      },
    );
  });

  test('should allow to bulk get a undefined values by their keys', async () => {
    const { redisKV } = (await $.run(['redisKV'])) as {
      redisKV: RedisKVService<number>;
    };

    const values = await redisKV.bulkGet(['lollolo', 'kikoolol']);

    expect(values).toEqual([undefined, undefined]);
  });

  test('should allow to set and get values by their keys', async () => {
    const keys = ['a', 'b', 'c', 'd'];
    const values = [1, 2, undefined, 4];

    const { redisKV } = (await $.run(['redisKV'])) as {
      redisKV: RedisKVService<number>;
    };

    await redisKV.bulkSet(keys, values);

    const retrievedValues = await redisKV.bulkGet(keys);

    expect(retrievedValues).toEqual(values);
  });
});
