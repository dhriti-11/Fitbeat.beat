import { Redis } from "@upstash/redis";

const PREFIX = "fitbeat:";

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

function getRedis() {
  const { url, token } = getRedisConfig();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isRedisConfigured() {
  const { url, token } = getRedisConfig();
  return Boolean(url && token);
}

export async function redisGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get<T>(PREFIX + key);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function redisSet<T>(key: string, value: T): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.set(PREFIX + key, value);
    return true;
  } catch {
    return false;
  }
}

export async function redisDel(key: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.del(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

export async function redisKeys(prefix = ""): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const keys = await redis.keys(PREFIX + prefix + "*");
    return keys.map((k) => k.slice(PREFIX.length));
  } catch {
    return [];
  }
}

export async function redisSetWithTTL<T>(key: string, value: T, ttlSeconds: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.set(PREFIX + key, value, { ex: ttlSeconds });
    return true;
  } catch {
    return false;
  }
}

export { PREFIX };
