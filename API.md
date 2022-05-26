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
