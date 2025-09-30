import { Redis } from '@upstash/redis';
import { REDIS_CONFIG } from './constants.js';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Redis helper functions
export class RedisClient {
  constructor() {
    this.prefix = REDIS_CONFIG.PREFIX;
  }

  // Generate prefixed key
  key(suffix) {
    return `${this.prefix}:${suffix}`;
  }

  // Set with TTL
  async set(key, value, ttl = REDIS_CONFIG.TTL.CACHE) {
    try {
      const prefixedKey = this.key(key);
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return await redis.setex(prefixedKey, ttl, value);
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  // Get value
  async get(key) {
    try {
      const prefixedKey = this.key(key);
      const value = await redis.get(prefixedKey);
      
      if (!value) return null;
      
      // Try to parse JSON, return string if parsing fails
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  // Delete key
  async del(key) {
    try {
      const prefixedKey = this.key(key);
      return await redis.del(prefixedKey);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }

  // Increment counter
  async incr(key, ttl = REDIS_CONFIG.TTL.RATE_LIMIT) {
    try {
      const prefixedKey = this.key(key);
      const current = await redis.incr(prefixedKey);
      
      // Set TTL only on first increment
      if (current === 1) {
        await redis.expire(prefixedKey, ttl);
      }
      
      return current;
    } catch (error) {
      console.error('Redis INCR error:', error);
      throw error;
    }
  }

  // Get TTL
  async ttl(key) {
    try {
      const prefixedKey = this.key(key);
      return await redis.ttl(prefixedKey);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  // Hash operations
  async hset(key, field, value, ttl = REDIS_CONFIG.TTL.CACHE) {
    try {
      const prefixedKey = this.key(key);
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      await redis.hset(prefixedKey, { [field]: value });
      await redis.expire(prefixedKey, ttl);
      return true;
    } catch (error) {
      console.error('Redis HSET error:', error);
      throw error;
    }
  }

  async hget(key, field) {
    try {
      const prefixedKey = this.key(key);
      const value = await redis.hget(prefixedKey, field);
      
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Redis HGET error:', error);
      return null;
    }
  }

  async hgetall(key) {
    try {
      const prefixedKey = this.key(key);
      const hash = await redis.hgetall(prefixedKey);
      
      if (!hash) return {};
      
      // Parse JSON values
      const parsed = {};
      for (const [field, value] of Object.entries(hash)) {
        try {
          parsed[field] = JSON.parse(value);
        } catch {
          parsed[field] = value;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error('Redis HGETALL error:', error);
      return {};
    }
  }

  // List operations
  async lpush(key, value, ttl = REDIS_CONFIG.TTL.CACHE) {
    try {
      const prefixedKey = this.key(key);
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      await redis.lpush(prefixedKey, value);
      await redis.expire(prefixedKey, ttl);
      return true;
    } catch (error) {
      console.error('Redis LPUSH error:', error);
      throw error;
    }
  }

  async lrange(key, start = 0, stop = -1) {
    try {
      const prefixedKey = this.key(key);
      const list = await redis.lrange(prefixedKey, start, stop);
      
      return list.map(item => {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      });
    } catch (error) {
      console.error('Redis LRANGE error:', error);
      return [];
    }
  }

  // Check connection
  async ping() {
    try {
      return await redis.ping();
    } catch (error) {
      console.error('Redis PING error:', error);
      return false;
    }
  }

  // Cleanup expired keys (manual cleanup)
  async cleanup() {
    try {
      const keys = await redis.keys(`${this.prefix}:*`);
      const expired = [];
      
      for (const key of keys) {
        const ttl = await redis.ttl(key);
        if (ttl === -1) { // No expiration set
          expired.push(key);
        }
      }
      
      if (expired.length > 0) {
        await redis.del(...expired);
      }
      
      return expired.length;
    } catch (error) {
      console.error('Redis CLEANUP error:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const redisClient = new RedisClient();

// Export raw redis client for advanced operations
export { redis };

export default redisClient;