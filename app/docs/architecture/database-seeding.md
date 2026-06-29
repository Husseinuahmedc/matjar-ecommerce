# Database Seeding

## Purpose
The seed script provides a reproducible test environment with a consistent set of users, categories, and products. It ensures that the development team can work with a "fresh" database state that includes real Supabase Auth accounts.

## How the Seed Works
The seed script (`prisma/seed.ts`) performs the following steps:

1.  **Clear Existing Data**: Deletes records from Prisma tables in the correct order to respect foreign key constraints.
2.  **Clear Supabase Auth Users**: Identifies and deletes the specific test users from Supabase Auth using the admin API (`supabase.auth.admin.deleteUser`).
3.  **Create Auth Accounts**: Creates real authentication accounts in Supabase using `supabase.auth.admin.createUser()`. This ensures that login functionality can be tested immediately.
4.  **Sync to Prisma**: Creates a corresponding record in the Prisma `User` table for each Supabase user, using the matching `UUID` as the primary key.
5.  **Metadata and Roles**: Stores the user's role in both Supabase `user_metadata` and the Prisma `User.role` field.
6.  **Categories and Products**: populates the catalog with bilingual data and images sourced from the `dummyjson.com` CDN.

## How to Re-seed
To reset the database and run the seed script, execute:
```bash
npx prisma db seed
```

## Test Accounts
| Email | Password | Role |
|-------|----------|------|
| `admin@matjar.com` | `Admin123!` | `ADMIN` |
| `seller@matjar.com` | `Seller123!` | `SELLER` |
| `buyer@matjar.com` | `Buyer123!` | `BUYER` |
| `support@matjar.com` | `Support123!` | `SUPPORT` |

## Data Sources
- **Product Images**: `https://cdn.dummyjson.com/products/images/...`
- **Pricing**: Hardcoded in IQD (Iraqi Dinar) to reflect local market values.
