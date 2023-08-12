[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# redis-kv-store
> A simple Redis based key/value store.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nfroidure/redis-kv-store/blob/main/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/nfroidure/redis-kv-store/badge.svg?branch=main)](https://coveralls.io/github/nfroidure/redis-kv-store?branch=main)


[//]: # (::contents:start)

This simple project provides a key/value store based on Redis. It has the exact
same API then the
[`memory-kv-store`](https://github.com/nfroidure/memory-kv-store) module and
relies on the [`redis-service`](https://github.com/nfroidure/redis-service)
module.

[//]: # (::contents:end)

# API
<a name="initRedisKV"></a>

## initRedisKV(services) ⇒ <code>Promise.&lt;RedisKVService&gt;</code>
Instantiate the Redis Key/Value service

**Kind**: global function  
**Returns**: <code>Promise.&lt;RedisKVService&gt;</code> - A promise of the Redis Key Value service  

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | The services to inject |
| services.redis | <code>function</code> | A `simple-redis-service` instance |
| services.log | <code>function</code> | A logging function |

**Example**  
```js
import initRedisService from 'simple-redis-service';
import initRedisKV from 'redis-kv-store';

const redis = await initRedisService({
  REDIS: {
    host: 'localhost',
    port: 6379,
  },
  ENV: process.env,
  log: console.log.bind(console),
});
const redisKV = await initRedisKV({
  redis,
  log: console.log.bind(console),
});

const value = await redisKV.get('my_key');
```

# Authors
- [Nicolas Froidure](http://insertafter.com/en/index.html)

# License
[MIT](https://github.com/nfroidure/redis-kv-store/blob/main/LICENSE)
