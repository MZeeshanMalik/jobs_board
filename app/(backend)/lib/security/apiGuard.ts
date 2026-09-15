// lib/security/apiGuard.ts
//
// Reusable protection layer for Next.js Route Handlers.
// Drop this into any /app/api/**/route.ts file — see usage example
// at the bottom of this file.
//
// Layers applied, in order:
//   1. HTTP method allow-list
//   2. Origin/Referer check    -> blocks the vast majority of casual
//                                  cross-site / external misuse
//   3. Optional shared-secret  -> for server-to-server calls between
//      header                     your own routes/services
//   4. In-memory IP rate limit -> caps damage even if 2-3 are bypassed
//
// IMPORTANT LIMITATIONS:
//
// - Origin/Referer headers are enforced by browsers, not by HTTP itself.
//   A request sent directly via curl/Postman/a backend script can set any
//   Origin it wants. This stack stops casual/automated misuse and
//   browser-JS abuse from other sites; it is NOT equivalent to
//   authentication. If you later add login/sessions, gate sensitive
//   routes on the session instead of (or in addition to) this.
//
// - The rate limiter below stores counts in a plain in-memory Map. That
//   memory is local to a single server process. On a traditional
//   long-running Node server this works exactly as expected. On
//   serverless platforms (Vercel, etc.) each invocation can land on a
//   different/fresh instance, so the count can reset more often than the
//   window implies under heavy or spread-out traffic — it still meaningfully
//   slows down bursts on a warm instance, just without the hard guarantee
//   a shared store (e.g. Redis) would give. Swap in a shared store later
//   if you need it to be exact.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

// ---------------------------------------------------------------------------
// In-memory rate limiter (fixed window per key)
// ---------------------------------------------------------------------------

interface Bucket {
  count: number;
  resetAt: number; // epoch ms
}

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the Map doesn't grow unbounded over a long-lived
// process. Harmless no-op cost on serverless (instance just gets recycled).
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();
function cleanupIfDue() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Returns true if the request under `key` is still within `limit` for the
 * current `windowMs` window; false if it should be blocked.
 */
function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupIfDue();

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientIp(req: NextRequest): string {
  // Vercel/most proxies set x-forwarded-for; first entry is the original client.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isAllowedOrigin(req: NextRequest): boolean {
  if (ALLOWED_ORIGINS.length === 0) return false; // fail closed if misconfigured

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  let candidate: string | null = origin;
  if (!candidate && referer) {
    try {
      candidate = new URL(referer).origin;
    } catch {
      candidate = null;
    }
  }

  if (!candidate) return false;
  return ALLOWED_ORIGINS.includes(candidate);
}

function hasValidSecret(req: NextRequest): boolean {
  if (!INTERNAL_API_SECRET) return false;
  const provided = req.headers.get("x-internal-api-key");
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(INTERNAL_API_SECRET);
  // timing-safe compare to avoid leaking the secret via response-time side channel
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Main guard
// ---------------------------------------------------------------------------

export interface ApiGuardOptions {
  /** HTTP methods this route accepts. Default: ["POST"] */
  allowedMethods?: string[];
  /**
   * If true, a request bearing a valid x-internal-api-key header is allowed
   * through even if Origin/Referer don't match — use for calls between your
   * own backend services. Leave false for routes only ever called from the
   * browser.
   */
  allowSecretHeaderBypass?: boolean;
  /** Custom rate limit for this route. Defaults to 20 requests / 60s per IP. */
  rateLimit?: { requests: number; windowSeconds: number };
  /** Namespaces the rate-limit key so routes don't share a budget. */
  identifierPrefix: string;
}

/**
 * Call at the top of your route handler. Returns a NextResponse if the
 * request should be blocked, or null if it should proceed.
 *
 *   const blocked = applyApiGuard(req, { identifierPrefix: "phone-validator" });
 *   if (blocked) return blocked;
 */
export function applyApiGuard(
  req: NextRequest,
  options: ApiGuardOptions,
): NextResponse | null {
  const {
    allowedMethods = ["POST"],
    allowSecretHeaderBypass = false,
    rateLimit = { requests: 20, windowSeconds: 60 },
    identifierPrefix,
  } = options;

  // 1. Method allow-list
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 },
    );
  }

  // 2 & 3. Origin check, with optional secret-header bypass for internal calls
  const originOk = isAllowedOrigin(req);
  const secretOk = allowSecretHeaderBypass ? hasValidSecret(req) : false;

  if (!originOk && !secretOk) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  // 4. Rate limit, keyed by IP + route namespace
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = checkRateLimit(
    `${identifierPrefix}:${ip}`,
    rateLimit.requests,
    rateLimit.windowSeconds * 1000,
  );

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests, please slow down." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.requests),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      },
    );
  }

  return null;
}
