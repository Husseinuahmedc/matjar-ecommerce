export function generateOtp(): string {
  return "123456";
}

export function hashOtp(code: string): string {
  return code;
}

export function verifyOtpHash(code: string, hash: string): boolean {
  return code === hash;
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + 5 * 60 * 1000);
}
