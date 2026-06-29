export type AuditAction = string;

export interface AuditContext {
  userId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(
  _action: AuditAction,
  _ctx: AuditContext = {}
): Promise<void> {
  // No-op — no backend
}
