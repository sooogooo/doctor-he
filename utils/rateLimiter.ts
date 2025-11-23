interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  requests: number[];
}

/**
 * Simple client-side rate limiter
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private state: RateLimitState;
  private storageKey: string;

  constructor(key: string, config: RateLimitConfig) {
    this.storageKey = `rateLimit_${key}`;
    this.config = config;
    this.state = this.loadState();
  }

  private loadState(): RateLimitState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }
    return { requests: [] };
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
      // Ignore errors
    }
  }

  private cleanOldRequests(): void {
    const now = Date.now();
    this.state.requests = this.state.requests.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(): boolean {
    this.cleanOldRequests();
    return this.state.requests.length < this.config.maxRequests;
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    this.cleanOldRequests();
    this.state.requests.push(Date.now());
    this.saveState();
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(): number {
    this.cleanOldRequests();
    return Math.max(0, this.config.maxRequests - this.state.requests.length);
  }

  /**
   * Get time until next request is available (in ms)
   */
  getTimeUntilReset(): number {
    if (this.canMakeRequest()) {
      return 0;
    }
    const oldestRequest = Math.min(...this.state.requests);
    return Math.max(0, this.config.windowMs - (Date.now() - oldestRequest));
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.state.requests = [];
    this.saveState();
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter('geminiApi', {
  maxRequests: 10, // 10 requests
  windowMs: 60 * 1000, // per minute
});

export const chatRateLimiter = new RateLimiter('chat', {
  maxRequests: 30, // 30 messages
  windowMs: 60 * 1000, // per minute
});

/**
 * Rate limit error
 */
export class RateLimitError extends Error {
  public retryAfter: number;

  constructor(retryAfter: number) {
    super(`请求过于频繁，请在 ${Math.ceil(retryAfter / 1000)} 秒后重试`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Wrapper function to apply rate limiting to async functions
 */
export async function withRateLimit<T>(
  limiter: RateLimiter,
  fn: () => Promise<T>
): Promise<T> {
  if (!limiter.canMakeRequest()) {
    throw new RateLimitError(limiter.getTimeUntilReset());
  }

  limiter.recordRequest();
  return fn();
}
