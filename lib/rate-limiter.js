import { redisClient } from './redis.js';
import { RATE_LIMITS, HTTP_STATUS, ERROR_MESSAGES } from './constants.js';

/**
 * Rate Limiter Class
 * Implements sliding window rate limiting with Redis
 */
export class RateLimiter {
  constructor() {
    this.redis = redisClient;
  }

  /**
   * Generate rate limit key
   */
  getRateLimitKey(identifier, window = 'default') {
    const timestamp = Math.floor(Date.now() / (RATE_LIMITS.WINDOW_MINUTES * 60 * 1000));
    return `rate_limit:${identifier}:${window}:${timestamp}`;
  }

  /**
   * Check and increment rate limit
   */
  async checkRateLimit(identifier, limit = RATE_LIMITS.MAX_REQUESTS_PER_WINDOW, windowMinutes = RATE_LIMITS.WINDOW_MINUTES) {
    try {
      const key = this.getRateLimitKey(identifier);
      const current = await this.redis.incr(key, windowMinutes * 60);
      
      const remaining = Math.max(0, limit - current);
      const resetTime = Math.ceil(Date.now() / 1000) + (windowMinutes * 60);
      
      return {
        allowed: current <= limit,
        limit,
        current,
        remaining,
        resetTime,
        retryAfter: current > limit ? windowMinutes * 60 : 0
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request if Redis is down
      return {
        allowed: true,
        limit,
        current: 0,
        remaining: limit,
        resetTime: Math.ceil(Date.now() / 1000) + (windowMinutes * 60),
        retryAfter: 0
      };
    }
  }

  /**
   * Check monthly API call limit for user
   */
  async checkMonthlyLimit(userId, userPlan = 'free') {
    try {
      const monthKey = `monthly_calls:${userId}:${this.getCurrentMonth()}`;
      const currentCalls = await this.redis.get(monthKey) || 0;
      
      let monthlyLimit;
      switch (userPlan) {
        case 'premium':
          monthlyLimit = RATE_LIMITS.FREE_CALLS_PER_MONTH * RATE_LIMITS.PREMIUM_MULTIPLIER;
          break;
        case 'enterprise':
          monthlyLimit = Infinity; // Unlimited
          break;
        default:
          monthlyLimit = RATE_LIMITS.FREE_CALLS_PER_MONTH;
      }
      
      return {
        allowed: currentCalls < monthlyLimit,
        current: parseInt(currentCalls),
        limit: monthlyLimit,
        remaining: monthlyLimit === Infinity ? Infinity : Math.max(0, monthlyLimit - currentCalls)
      };
    } catch (error) {
      console.error('Monthly limit check error:', error);
      return {
        allowed: true,
        current: 0,
        limit: RATE_LIMITS.FREE_CALLS_PER_MONTH,
        remaining: RATE_LIMITS.FREE_CALLS_PER_MONTH
      };
    }
  }

  /**
   * Increment monthly usage
   */
  async incrementMonthlyUsage(userId) {
    try {
      const monthKey = `monthly_calls:${userId}:${this.getCurrentMonth()}`;
      const newCount = await this.redis.incr(monthKey, 30 * 24 * 60 * 60); // 30 days TTL
      return newCount;
    } catch (error) {
      console.error('Increment monthly usage error:', error);
      return 0;
    }
  }

  /**
   * Get current month string (YYYY-MM)
   */
  getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Rate limit middleware for API routes
   */
  middleware(options = {}) {
    const {
      keyGenerator = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      limit = RATE_LIMITS.MAX_REQUESTS_PER_WINDOW,
      windowMinutes = RATE_LIMITS.WINDOW_MINUTES,
      message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      standardHeaders = true,
      legacyHeaders = false
    } = options;

    return async (req, res, next) => {
      try {
        const key = keyGenerator(req);
        const rateLimitInfo = await this.checkRateLimit(key, limit, windowMinutes);
        
        // Add headers
        if (standardHeaders) {
          res.setHeader('RateLimit-Limit', rateLimitInfo.limit);
          res.setHeader('RateLimit-Remaining', rateLimitInfo.remaining);
          res.setHeader('RateLimit-Reset', rateLimitInfo.resetTime);
        }
        
        if (legacyHeaders) {
          res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
          res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining);
          res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime);
        }
        
        if (!rateLimitInfo.allowed) {
          res.setHeader('Retry-After', rateLimitInfo.retryAfter);
          return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
            error: message,
            retryAfter: rateLimitInfo.retryAfter
          });
        }
        
        // Add rate limit info to request object
        req.rateLimit = rateLimitInfo;
        
        if (next) next();
      } catch (error) {
        console.error('Rate limit middleware error:', error);
        // Fail open - continue processing
        if (next) next();
      }
    };
  }

  /**
   * Reset rate limit for identifier
   */
  async resetRateLimit(identifier) {
    try {
      const key = this.getRateLimitKey(identifier);
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Reset rate limit error:', error);
      return false;
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(identifier) {
    try {
      const key = this.getRateLimitKey(identifier);
      const current = await this.redis.get(key) || 0;
      const ttl = await this.redis.ttl(key);
      
      return {
        current: parseInt(current),
        limit: RATE_LIMITS.MAX_REQUESTS_PER_WINDOW,
        remaining: Math.max(0, RATE_LIMITS.MAX_REQUESTS_PER_WINDOW - current),
        resetTime: ttl > 0 ? Math.ceil(Date.now() / 1000) + ttl : null
      };
    } catch (error) {
      console.error('Get rate limit status error:', error);
      return {
        current: 0,
        limit: RATE_LIMITS.MAX_REQUESTS_PER_WINDOW,
        remaining: RATE_LIMITS.MAX_REQUESTS_PER_WINDOW,
        resetTime: null
      };
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

export default rateLimiter;