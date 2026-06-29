export async function sendOtp(_phone: string, _ip: string) {
  return { success: true as const, data: { maskedPhone: "+964 7XX XXX 456" } };
}

export async function verifyOtp(_phone: string, _code: string) {
  return { success: true as const, data: { verifiedToken: "mock-token" } };
}

export async function checkPhoneExists(_phone: string): Promise<boolean> {
  return false;
}

export async function validateVerifiedToken(_phone: string, _token: string): Promise<boolean> {
  return true;
}

export async function invalidateVerifiedToken(_phone: string, _token: string): Promise<void> {}

export async function cleanupExpiredOtps(): Promise<void> {}

export function formatPhoneForDisplay(phone: string): string {
  if (phone.length < 7) return phone;
  const prefix = phone.slice(0, 4);
  const suffix = phone.slice(-3);
  const masked = "X".repeat(Math.max(3, phone.length - 7));
  return `${prefix} ${masked} ${suffix}`;
}
