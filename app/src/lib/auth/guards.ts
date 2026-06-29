import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/navigation";

export interface AuthSession {
  userId: string;
  email: string;
  role: AppRole;
  fullName: string;
}

const DEMO_USER: AuthSession = {
  userId: "demo-user",
  email: "demo@example.com",
  role: "BUYER",
  fullName: "Demo User",
};

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function getServerSession(): Promise<AuthSession> {
  return DEMO_USER;
}

export async function requireAuth(_roles?: AppRole[]): Promise<AuthSession> {
  return DEMO_USER;
}

export async function requireRole(_role: AppRole): Promise<AuthSession> {
  return DEMO_USER;
}

export function hasRole(_session: AuthSession, _roles: AppRole[]): boolean {
  return true;
}

export class AuthError extends Error {
  public readonly code: "UNAUTHORIZED" | "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    this.code = message.startsWith("FORBIDDEN") ? "FORBIDDEN" : "UNAUTHORIZED";
  }
}
