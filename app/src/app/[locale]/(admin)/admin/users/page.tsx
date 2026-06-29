import type { Metadata } from "next"
import { Link } from "@/i18n/routing"
import {
  Badge,
} from "@/components/ui"

export const metadata: Metadata = {
  title: "Admin Users",
}

const mockUsers = [
  { id: "1", fullName: "Admin User", email: "admin@matjar.com", role: "ADMIN", _count: { orders: 15 }, createdAt: new Date("2026-01-01") },
  { id: "2", fullName: "Demo Seller", email: "seller@matjar.com", role: "SELLER", _count: { orders: 8 }, createdAt: new Date("2026-02-15") },
  { id: "3", fullName: "Demo User", email: "demo@example.com", role: "BUYER", _count: { orders: 12 }, createdAt: new Date("2026-03-10") },
  { id: "4", fullName: "Support Staff", email: "support@matjar.com", role: "SUPPORT", _count: { orders: 0 }, createdAt: new Date("2026-04-01") },
]

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ role?: string }>
}

export default async function AdminUsersPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { role: roleFilter } = await searchParams
  const isAr = locale === "ar"

  const users = roleFilter
    ? mockUsers.filter(u => u.role === roleFilter)
    : mockUsers

  const roles = ["ADMIN", "SELLER", "BUYER", "SUPPORT"] as const

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isAr ? "إدارة المستخدمين" : "User Management"}
      </h1>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        <Link
          href={`/${locale}/admin/users`}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !roleFilter ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
          }`}
        >
          {isAr ? "الكل" : "All"}
        </Link>
        {roles.map((r) => (
          <Link
            key={r}
            href={`/${locale}/admin/users?role=${r}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              roleFilter === r ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            }`}
          >
            {isAr
              ? ({
                  ADMIN: "مدير",
                  SELLER: "بائع",
                  BUYER: "مشتري",
                  SUPPORT: "دعم",
                }[r] || r)
              : r.charAt(0) + r.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الاسم" : "Name"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "البريد الإلكتروني" : "Email"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الدور" : "Role"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الطلبات" : "Orders"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "تاريخ الانضمام" : "Joined"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  {isAr ? "لا يوجد مستخدمين" : "No users found"}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {u.fullName.charAt(0).toUpperCase()}
                      </span>
                      {u.fullName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "destructive"
                          : u.role === "SELLER"
                          ? "default"
                          : u.role === "SUPPORT"
                          ? "secondary"
                          : "outline"
                      }
                    >
                        {isAr
                        ? ({
                            ADMIN: "مدير",
                            SELLER: "بائع",
                            BUYER: "مشتري",
                            SUPPORT: "دعم",
                          } as Record<string, string>)[u.role] || u.role
                        : u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{u._count.orders}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString(isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
