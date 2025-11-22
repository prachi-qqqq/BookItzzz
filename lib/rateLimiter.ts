import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(key: string, limit = 100, windowSeconds = 60) {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${key}:${Math.floor(now / windowSeconds)}`;
  const current = await redis.incr(windowKey);
  if (current === 1) {
    await redis.expire(windowKey, windowSeconds);
  }
  const remaining = Math.max(0, limit - current);
  return { ok: current <= limit, remaining, reset: windowSeconds };
}

export default redis;
