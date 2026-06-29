import type { Metadata } from "next"
import { BuyerSidebar } from "@/components/dashboard/BuyerSidebar"
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav"
import { DashboardAnimationWrapper } from "../dashboard/dashboard-animation-wrapper"
import { Settings, User, Mail, Phone, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "إعدادات الحساب | Account Settings",
}

const mockUser = {
  fullName: "Demo User",
  email: "demo@example.com",
  phone: "+964 7XX XXX 456",
  role: "BUYER",
  rewardPoints: 150,
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const roleLabels: Record<string, { ar: string; en: string }> = {
    BUYER: { ar: "مشتري", en: "Buyer" },
    SELLER: { ar: "بائع", en: "Seller" },
    ADMIN: { ar: "مدير", en: "Admin" },
    SUPPORT: { ar: "دعم", en: "Support" },
  }

  return (
    <div className="flex">
      <div className="hidden md:block">
        <BuyerSidebar />
      </div>
      <MobileDashboardNav />

      <DashboardAnimationWrapper>
        <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              {locale === "ar" ? "إعدادات الحساب" : "Account Settings"}
            </h1>
          </div>

          <div className="rounded-xl border bg-card shadow-sm divide-y">
            <div className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{locale === "ar" ? "الاسم الكامل" : "Full Name"}</p>
                <p className="font-medium">{mockUser.fullName}</p>
              </div>
            </div>

            <div className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                <p className="font-medium">{mockUser.email}</p>
              </div>
            </div>

            <div className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{locale === "ar" ? "رقم الهاتف" : "Phone"}</p>
                <p className="font-medium">{mockUser.phone}</p>
              </div>
            </div>

            <div className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{locale === "ar" ? "نوع الحساب" : "Account Type"}</p>
                <p className="font-medium">{roleLabels[mockUser.role]?.[locale === "ar" ? "ar" : "en"] || mockUser.role}</p>
              </div>
            </div>
          </div>

          {mockUser.rewardPoints > 0 && (
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{locale === "ar" ? "نقاط المكافآت" : "Reward Points"}</p>
                  <p className="text-2xl font-bold text-primary">{mockUser.rewardPoints}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "نقاط قابلة للاستخدام عند الشراء" : "Redeemable at checkout"}
                </p>
              </div>
            </div>
          )}
        </div>
      </DashboardAnimationWrapper>
    </div>
  )
}
