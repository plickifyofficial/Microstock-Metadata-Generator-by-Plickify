/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for a single serverless region / small traffic. For heavy
 * multi-instance deployments swap in Upstash Redis or Vercel KV - the
 * call-site contract stays the same.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** Periodically drop stale buckets so the map doesn't grow forever. */
let lastSweep = 0;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60 * 60 * 1000
): RateLimitResult {
  const now = Date.now();

  if (now - lastSweep > 10 * 60 * 1000) {
    lastSweep = now;
    for (const [k, b] of buckets) {
      b.timestamps = b.timestamps.filter((t) => now - t < windowMs);
      if (b.timestamps.length === 0) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSeconds: 0,
  };
}

import { createHash } from "crypto";

/** Salted IP hash for abuse monitoring - raw IPs are never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || process.env.NEXT_PUBLIC_SUPABASE_URL || "mmg";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
