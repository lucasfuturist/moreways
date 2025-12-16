// apps/law/src/shared/utils/resilience.ts

export type RetryOptions = {
  /**
   * Max number of retries AFTER the first attempt.
   * total attempts = 1 + maxRetries
   */
  maxRetries?: number;

  /** Initial backoff delay in ms */
  initialDelayMs?: number;

  /** Maximum backoff delay in ms */
  maxDelayMs?: number;

  /** Multiplier applied to the delay each retry */
  factor?: number;

  /** Add +/- jitter% randomness to delay (0.2 = +/-20%) */
  jitter?: number;

  /**
   * Hard time limit for the whole retry operation (ms).
   * If exceeded, throws the last error.
   */
  maxDurationMs?: number;

  /**
   * Decide if an error should be retried.
   * Defaults to common transient/network/429/5xx behavior.
   */
  retryOn?: (err: any, attempt: number) => boolean;

  /**
   * Optional hook for logging.
   */
  onRetry?: (err: any, attempt: number, delayMs: number) => void;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function applyJitter(delayMs: number, jitter: number) {
  const j = clamp(jitter, 0, 1);
  if (j === 0) return delayMs;
  const rand = (Math.random() * 2 - 1) * j; // [-j, +j]
  return Math.max(0, Math.round(delayMs * (1 + rand)));
}

function defaultRetryOn(err: any) {
  // OpenAI SDK errors often have `status` or `code`
  const status = err?.status ?? err?.response?.status;

  if (typeof status === "number") {
    // rate limit + transient server/gateway errors
    if (status === 429) return true;
    if (status >= 500 && status <= 599) return true;
    // timeouts from gateways sometimes appear here
    if (status === 408) return true;
  }

  // PostgREST/Supabase can expose postgres codes like 57014 (query canceled/timeout)
  const pgCode = err?.code;
  if (pgCode === "57014") return true;

  // node network-ish errors
  const nodeCode = err?.cause?.code ?? err?.code;
  if (
    nodeCode === "ETIMEDOUT" ||
    nodeCode === "ECONNRESET" ||
    nodeCode === "EAI_AGAIN" ||
    nodeCode === "ENOTFOUND" ||
    nodeCode === "ECONNREFUSED"
  ) {
    return true;
  }

  // generic message heuristics (last resort)
  const msg = String(err?.message ?? "").toLowerCase();
  if (msg.includes("timeout")) return true;
  if (msg.includes("rate limit")) return true;
  if (msg.includes("temporar")) return true; // temporary/temporarily
  if (msg.includes("overloaded")) return true;

  return false;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 8000,
    factor = 2,
    jitter = 0.2,
    maxDurationMs,
    retryOn,
    onRetry,
  } = options;

  const startedAt = Date.now();
  let attempt = 0; // 0 = first attempt
  let delay = Math.max(0, initialDelayMs);
  let lastErr: any;

  const shouldRetry = retryOn ?? ((err: any, _attempt: number) => defaultRetryOn(err));

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (err) {
      lastErr = err;

      // If we’re out of retries, bail
      if (attempt >= maxRetries) break;

      // If error is non-retryable, bail immediately
      if (!shouldRetry(err, attempt)) break;

      // If we have a max duration, enforce it
      if (typeof maxDurationMs === "number") {
        const elapsed = Date.now() - startedAt;
        // if we cannot afford even the next delay, stop now
        if (elapsed + delay > maxDurationMs) break;
      }

      const waitMs = applyJitter(delay, jitter);
      onRetry?.(err, attempt + 1, waitMs);

      await sleep(waitMs);

      delay = Math.min(maxDelayMs, Math.round(delay * factor));
      attempt += 1;
    }
  }

  throw lastErr;
}
