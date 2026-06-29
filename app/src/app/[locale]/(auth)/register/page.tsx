import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "إنشاء حساب | Sign Up",
};

/**
 * Register page.
 * Allows new users to create a Buyer or Seller account.
 *
 * Architecture note:
 * - Form submit → Server Action (actions/auth.ts → signUp)
 * - Server Action calls Supabase Auth signUp and inserts into public users table
 * - On success, the user is redirected to the corresponding dashboard.
 */
export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <RegisterForm />
    </div>
  );
}
