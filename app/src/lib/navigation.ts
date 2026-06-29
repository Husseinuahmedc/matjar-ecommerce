/**
 * Centralized navigation helpers.
 *
 * Single source of truth for role-to-dashboard mapping.
 * Import this instead of duplicating the switch in middleware, actions, etc.
 */

export type AppRole = "ADMIN" | "SELLER" | "BUYER" | "SUPPORT" | "SUPER_ADMIN";

/**
 * Returns the default dashboard path for a given role (without locale prefix).
 */
export function getDashboardPath(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin/dashboard";
    case "SELLER":
      return "/seller/dashboard";
    case "SUPPORT":
      return "/support/orders";
    case "BUYER":
    default:
      return "/buyer/dashboard";
  }
}

/**
 * Role-to-path prefix mapping for middleware route protection.
 * A user may only access routes that start with any of their allowed prefixes.
 */
export const PROTECTED_ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN: ["/admin", "/seller", "/buyer", "/support", "/orders", "/checkout"],
  ADMIN:   ["/admin", "/checkout", "/orders"],
  SELLER:  ["/seller", "/checkout", "/orders"],
  SUPPORT: ["/support", "/checkout", "/orders"],
  BUYER:   ["/buyer", "/orders", "/checkout"],
};

/**
 * Paths that are only accessible to unauthenticated users.
 * Logged-in users will be redirected to their dashboard.
 */
export const AUTH_ONLY_PATHS = [
  "/login",
  "/register",
  "/phone-login",
  "/phone-register",
  "/forgot-password",
];

/**
 * Paths that should never be redirected away from, even if logged in.
 */
export const PUBLIC_PATHS = [
  "/",
  "/products",
  "/cart",
  "/verify-email",
  "/reset-password",
];
