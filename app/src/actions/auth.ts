"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { ActionResult } from "@/types";
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@/features/auth/schema";

export interface AuthSuccessData {
  role: "ADMIN" | "SELLER" | "BUYER" | "SUPPORT";
  emailVerified: boolean;
}

export async function signIn(_data: SignInInput & { rememberMe?: boolean }): Promise<ActionResult<AuthSuccessData>> {
  redirect(`/${routing.defaultLocale}/buyer/dashboard`);
}

export async function signUp(_data: SignUpInput): Promise<ActionResult<AuthSuccessData>> {
  return {
    success: true,
    data: { role: _data.role as AuthSuccessData["role"], emailVerified: true },
  };
}

export async function signOut() {
  redirect(`/${routing.defaultLocale}/login`);
}

export async function resendVerificationEmail(_email: string): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function requestPasswordReset(_email: string): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function resetPassword(_newPassword: string): Promise<ActionResult> {
  redirect(`/${routing.defaultLocale}/login?reset=success`);
}
