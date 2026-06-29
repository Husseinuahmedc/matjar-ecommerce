import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/ar/login?error=auth_failed", "http://localhost:3000"));
}
