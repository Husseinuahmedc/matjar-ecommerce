export type RateLimitAction = string;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export async function checkRateLimit(
  _key: string,
  _action: RateLimitAction
): Promise<RateLimitResult> {
  return { allowed: true, remaining: 999 };
}

export async function resetRateLimit(
  _key: string,
  _action: RateLimitAction
): Promise<void> {}

export async function pruneRateLimits(): Promise<void> {}
