// In-memory sliding-window rate limiter.
// Works per-dev-server lifetime (dev/serverless resets on restart).
const store = new Map();

// Hard cap so spoofed x-forwarded-for values can't grow the Map unbounded.
// Keys are evicted oldest-first (Map preserves insertion order).
const MAX_KEYS = 5000;

function enforceCap() {
  while (store.size >= MAX_KEYS) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

function prune(key, now, windowMs) {
  const arr = store.get(key);
  if (!arr) return [];
  const cutOff = now - windowMs;
  const kept = [];
  for (const ts of arr) {
    if (ts > cutOff) kept.push(ts);
  }
  if (kept.length === 0) {
    store.delete(key);
  } else {
    store.set(key, kept);
  }
  return kept;
}

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const arr = prune(key, now, windowMs);
  if (arr.length >= limit) {
    const oldest = arr[0];
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { ok: false, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
  }
  arr.push(now);
  if (!store.has(key)) enforceCap();
  store.set(key, arr);
  return { ok: true };
}

export function getClientIp(request) {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map(s => s.trim());
    return parts[parts.length - 1] || 'unknown';
  }
  return 'unknown';
}
