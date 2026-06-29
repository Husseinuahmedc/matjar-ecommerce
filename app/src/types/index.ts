/**
 * Shared TypeScript types used across multiple features.
 * Feature-specific types live in their own feature folder.
 */

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "SELLER" | "BUYER" | "SUPPORT" | "SUPER_ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

// ─── Common API Response Shape ────────────────────────────────────────────────

/**
 * Standard return type for all Server Actions.
 * T is the data payload on success.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; issues?: string[] };

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type Locale = "ar" | "en";
