import SellerSidebar from "@/components/seller/seller-sidebar";
import { Toaster } from "@/components/ui/sonner";

interface SellerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SellerLayout({ children, params }: SellerLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-background" dir={locale === "ar" ? "rtl" : "ltr"}>
      <SellerSidebar locale={locale} />
      <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 md:pt-8">
        {children}
      </main>
      <Toaster position={locale === "ar" ? "top-left" : "top-right"} richColors />
    </div>
  );
}
