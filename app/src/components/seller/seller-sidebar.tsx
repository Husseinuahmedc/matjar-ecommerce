"use client"

import { useState } from "react"
import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react"
import { signOut } from "@/actions/auth"
import { LogOut } from "lucide-react"

interface SellerSidebarProps {
  locale: string
}

const navItems = [
  { href: "/seller/dashboard", labelAr: "لوحة التحكم", labelEn: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", labelAr: "المنتجات", labelEn: "Products", icon: Package },
  { href: "/seller/orders", labelAr: "الطلبات", labelEn: "Orders", icon: ShoppingCart },
]

export default function SellerSidebar({ locale }: SellerSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isAr = locale === "ar"

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 z-40 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-sm md:hidden"
        style={{ [isAr ? "right" : "left"]: "1rem" }}
        aria-label={isAr ? "فتح القائمة" : "Open menu"}
      >
        <Menu className="h-4 w-4" />
        {isAr ? "القائمة" : "Menu"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 z-40 flex h-screen w-64 flex-col border-r bg-card transition-transform duration-200",
          isAr ? "right-0 border-l" : "left-0",
          open ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link
            href={`/${locale}/seller/dashboard`}
            className="text-lg font-bold"
          >
            {isAr ? "لوحة التاجر" : "Seller Panel"}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 hover:bg-secondary md:hidden"
            aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4 space-y-2">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isAr ? "العودة إلى الموقع" : "Back to site"}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              {isAr ? "تسجيل الخروج" : "Log Out"}
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
