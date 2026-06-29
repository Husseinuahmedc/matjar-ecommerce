import type { Metadata } from "next"
import { BuyerSidebar } from "@/components/dashboard/BuyerSidebar"
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav"
import { DashboardAnimationWrapper } from "../dashboard/dashboard-animation-wrapper"
import { MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "عناوين الشحن | Shipping Addresses",
}

const mockAddresses: Array<{
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}> = []

export default async function AddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div className="flex">
      <div className="hidden md:block">
        <BuyerSidebar />
      </div>
      <MobileDashboardNav />

      <DashboardAnimationWrapper>
        <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">
                {locale === "ar" ? "عناوين الشحن" : "Shipping Addresses"}
              </h1>
            </div>
          </div>

          {mockAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <MapPin className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {locale === "ar" ? "لا توجد عناوين محفوظة" : "No saved addresses"}
              </h2>
              <p className="text-muted-foreground">
                {locale === "ar" ? "أضف عنواناً عند إتمام الشراء التالي" : "Add an address during your next checkout"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAddresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-xl border bg-card p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-semibold">{address.fullName}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                    </div>
                    {address.isDefault && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {locale === "ar" ? "افتراضي" : "Default"}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardAnimationWrapper>
    </div>
  )
}
