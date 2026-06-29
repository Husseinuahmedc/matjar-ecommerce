"use server";

import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { ActionResult } from "@/types";
import type { AuthSuccessData } from "@/actions/auth";

export async function sendPhoneOtp(_prevState: unknown, _formData: FormData): Promise<ActionResult<{ maskedPhone: string }>> {
  return { success: true, data: { maskedPhone: "+964 7XX XXX 456" } };
}

export async function verifyPhoneOtp(_prevState: unknown, _formData: FormData): Promise<ActionResult<{ verifiedToken: string; isNewUser: boolean }>> {
  return {
    success: true,
    data: {
      verifiedToken: "mock-token",
      isNewUser: false,
    },
  };
}

export async function completeRegistration(
  _prevState: unknown,
  _formData: FormData
): Promise<ActionResult<AuthSuccessData>> {
  redirect(`/${routing.defaultLocale}/buyer/dashboard`);
}

export async function completeLogin(
  _prevState: unknown,
  _formData: FormData
): Promise<ActionResult<AuthSuccessData>> {
  redirect(`/${routing.defaultLocale}/buyer/dashboard`);
}
