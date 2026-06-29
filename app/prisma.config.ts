/**
 * Prisma 7 configuration file.
 *
 * This config is used by Prisma CLI tools only (migrate, studio, generate, seed).
 * The application runtime PrismaClient uses DATABASE_URL independently via lib/db.ts.
 *
 * We use DIRECT_URL here (session-mode pooler, port 5432) because CLI operations
 * like migrations require DDL support that PgBouncer transaction-mode (port 6543)
 * does not provide. Falls back to DATABASE_URL if DIRECT_URL is not set.
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
