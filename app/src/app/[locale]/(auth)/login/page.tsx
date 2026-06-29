import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Log In",
};

/**
 * Login page.
 * Renders the login form for email/password authentication via Supabase.
 *
 * Architecture note:
 * - The form submit calls a Server Action (actions/auth.ts → signIn)
 * - The Server Action talks to Supabase Auth and queries the Prisma database for the role
 * - On success, the user is redirected to the corresponding dashboard.
 */
export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <LoginForm />
    </div>
  );
}
