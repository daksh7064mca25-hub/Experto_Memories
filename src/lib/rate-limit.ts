/**
 * Simple in-memory sliding-window rate limiter for serverless Next.js API routes.
 * Tracks client IP submission rates and automatically cleans up expired buckets.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipBuckets = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  const expiry = now - windowMs;
  for (const [key, record] of ipBuckets.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > expiry);
    if (record.timestamps.length === 0) {
      ipBuckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks whether an identifier (e.g. client IP) has exceeded the rate limit.
 *
 * @param identifier Client IP or unique actor key
 * @param limit Max allowed requests within window (default: 5)
 * @param windowMs Window duration in milliseconds (default: 10 minutes = 600,000ms)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(windowMs);

  const key = identifier || "unknown-client";
  let record = ipBuckets.get(key);

  if (!record) {
    record = { timestamps: [] };
    ipBuckets.set(key, record);
  }

  // Filter timestamps within current window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    const resetMs = oldest + windowMs - now;
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.ceil(Math.max(1, resetMs / 1000)),
    };
  }

  // Record this request
  record.timestamps.push(now);

  const remaining = Math.max(0, limit - record.timestamps.length);
  return {
    success: true,
    limit,
    remaining,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Helper to safely extract client IP from incoming Next.js Request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}
