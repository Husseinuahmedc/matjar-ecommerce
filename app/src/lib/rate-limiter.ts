export interface PhoneRateInfo {
  requestCount: number;
  windowStart: Date;
  latestOtpCreatedAt: Date | null;
}

export async function checkIpRateLimit(_ip: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  return { allowed: true };
}

export function pruneIpStore(): void {}

export async function checkPhoneRateLimit(_info: PhoneRateInfo): Promise<{ allowed: boolean; retryAfterMs?: number; cooldownRemainingMs?: number }> {
  return { allowed: true };
}
